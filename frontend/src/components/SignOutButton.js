// src/SignOutButton.js
import React from "react";
import { useAuth } from '../contexts/AuthContext'; 

export function SignOutButton({ onSignOut }) { 
  const { logout } = useAuth(); 
  const handleSignOut = () => {
    logout(); 
    if (onSignOut) {
      onSignOut(); 
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 text-sm"
    >
      Sign Out
    </button>
  );
}