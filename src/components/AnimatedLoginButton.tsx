import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

interface AnimatedLoginButtonProps {
  onClick?: () => void;
  className?: string;
}

export function AnimatedLoginButton({ 
  onClick, 
  className = ""
}: AnimatedLoginButtonProps) {
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
      <span>Login</span>
      <LogIn 
        className="w-5 h-5 transition-all duration-300"
        style={{
          color: isHovered ? '#ffffff' : '#000000'
        }}
      />
    </button>
  );
}