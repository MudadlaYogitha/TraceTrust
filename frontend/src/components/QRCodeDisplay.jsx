import React from 'react';
import { toast } from "sonner";
import { QRCodeSVG } from 'qrcode.react'; 

export function QRCodeDisplay({ qrCode, productName }) {
  const copyToClipboard = () => {
    const tempInput = document.createElement('input');
    tempInput.value = qrCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        toast.success("QR Code copied to clipboard!");
    } catch (err) {
        console.error('Failed to copy QR Code:', err);
        toast.error("Failed to copy QR Code. Please copy manually.");
    } finally {
        document.body.removeChild(tempInput);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 font-sans">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Product QR Code</h3>
        <div className="inline-block p-4 bg-gray-100 rounded-lg mb-6">
            {qrCode ? (
                <QRCodeSVG 
                value={`${process.env.REACT_APP_FRONTEND_URL}/verify?code=${qrCode}`}
                    size={256}   
                    level="H"   
                    includeMargin={true}
                    className="rounded-lg border-2 border-gray-300"
                />
            ) : (
                <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📱</div>
                        <p className="text-sm text-gray-600 mb-2">Generating QR Code for</p>
                        <p className="font-bold text-gray-900">{productName}</p>
                    </div>
                </div>
            )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Value
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={qrCode}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Instructions:</strong>
            </p>
            <ul className="text-left space-y-1 max-w-md mx-auto">
              <li>• Print this QR code on product packaging</li>
              <li>• Consumers can scan to view product journey</li>
              <li>• Each scan is tracked for analytics</li>
              <li>• QR code links to blockchain-verified data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}