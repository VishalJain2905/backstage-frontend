interface HeroBackgroundProps {
  className?: string;
}

export function HeroBackground({ className = "" }: HeroBackgroundProps) {
  // Create 8 petals/teardrops arranged in a circle
  const petals = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Pure black base */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Rotating radial petal pattern */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px]"
        style={{
          animation: 'rotateClockwise 8s linear infinite'
        }}
      >
        {petals.map((index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              width: '60px',
              height: '120px',
              transform: `translate(-50%, -100%) rotate(${index * 45}deg)`,
            }}
          >
            {/* Petal shape */}
            <div
              className="w-full h-full bg-white opacity-90"
              style={{
                clipPath: 'ellipse(50% 100% at 50% 100%)',
                transformOrigin: 'bottom center',
              }}
            />
          </div>
        ))}
      </div>
      

      
      {/* Outer subtle glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[700px] md:h-[700px] rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.05) 60%, transparent 80%)`,
          filter: 'blur(3px)'
        }}
      />
      
      {/* Left side text protection gradient */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse 300px 500px at 20% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 60%, transparent 80%)`
        }}
      />
      
      {/* Right side text protection gradient */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse 300px 500px at 80% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 60%, transparent 80%)`
        }}
      />
      
      {/* Edge vignette */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 80%, #000000 100%)`
        }}
      />
      
      <style>{`
        @keyframes rotateClockwise {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}