interface SimpleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'white' | 'glassmorphism';
  className?: string;
}

export function SimpleButton({ 
  children, 
  onClick, 
  variant = 'glassmorphism',
  className = ""
}: SimpleButtonProps) {
  const baseClasses = "relative px-4 py-4 rounded-full transition-all duration-300 group overflow-hidden min-w-[200px] flex items-center justify-center";
  
  const variantClasses = {
    white: "bg-white text-black hover:bg-gray-50 hover:shadow-lg hover:shadow-black/10",
    glassmorphism: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:shadow-2xl hover:shadow-white/20"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={variant === 'glassmorphism' ? {
        boxShadow: '0 8px 32px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
        textShadow: '0 0 10px rgba(255,255,255,0.3)'
      } : {}}
    >
      <span className="relative z-10 font-medium text-[16px]">
        {children}
      </span>
      
      {variant === 'glassmorphism' && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      {variant === 'white' && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/5 to-black/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
    </button>
  );
}