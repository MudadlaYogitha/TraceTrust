// src/components/QRScanner.js
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();
  const API_PRODUCTS_BASE_URL = `${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/api/products`;

  useEffect(() => {
    const qrcodeRegionId = "reader";
    let html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    const onScanSuccess = async (decodedText, decodedResult) => {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      setScanResult(decodedText);
      html5QrcodeScanner.clear();
      toast.success(`QR Code Scanned: ${decodedText}`);
      try {
        const response = await fetch(`${API_PRODUCTS_BASE_URL}/${decodedText}/scan`, {
          method: 'POST',
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to update scan count:', errorData.message);
        }
        console.log('Scan count updated successfully.');
      } catch (error) {
        console.error('Failed to update scan count (network error/server down):', error);
      }

      navigate(`/product/${decodedText}`);
    };

    const onScanError = (errorMessage) => {
    };

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner:", error);
      });
    };
  }, [navigate, API_PRODUCTS_BASE_URL]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Scan Product QR Code</h1>
      <p className="text-lg text-gray-600 mb-4">Point your camera at the QR code to view traceability.</p>
      <div id="reader" className="w-full max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
      </div>
      {scanResult && (
        <p className="mt-4 text-green-600 text-xl">Successfully Scanned: {scanResult}</p>
      )}
    </div>
  );
}