import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

interface AnimatedConnectWalletButtonProps {
  onClick?: () => void;
  className?: string;
}

export function AnimatedConnectWalletButton({ 
  onClick, 
  className = ""
}: AnimatedConnectWalletButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 font-medium ml-auto ${className}`}
      style={{
        backgroundColor: isHovered ? '#1a1a1a' : '#ffffff',
        color: isHovered ? '#ffffff' : '#000000',
        border: isHovered ? '2px solid #ffffff' : '2px solid transparent',
        fontSize: '16px',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <span>Connect Wallet</span>
      <Wallet 
        className="w-5 h-5 transition-all duration-300"
        style={{
          color: isHovered ? '#ffffff' : '#000000'
        }}
      />
    </button>
  );
}