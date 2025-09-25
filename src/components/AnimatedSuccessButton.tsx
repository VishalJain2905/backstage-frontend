import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

interface AnimatedSuccessButtonProps {
  onComplete?: () => void;
  className?: string;
}

export function AnimatedSuccessButton({ onComplete, className = "" }: AnimatedSuccessButtonProps) {
  const [buttonState, setButtonState] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    // Transition to success immediately with just a brief animation delay
    const timer = setTimeout(() => {
      setButtonState('success');
      onComplete?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getButtonVariants = () => ({
    loading: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.3)",
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    success: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(16, 185, 129, 0.5)",
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  });

  const getSpinnerVariants = () => ({
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: "linear",
        repeat: Infinity
      }
    }
  });

  const getCheckmarkVariants = () => ({
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.2 }
      }
    }
  });

  return (
    <motion.div
      className={`relative flex items-center justify-center overflow-hidden shadow-lg ${className}`}
      variants={getButtonVariants()}
      initial="loading"
      animate={buttonState}
      style={{
        width: '64px',
        height: '64px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
    >

      {/* Loading Spinner */}
      <AnimatePresence>
        {buttonState === 'loading' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
              variants={getSpinnerVariants()}
              animate="spin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Checkmark */}
      <AnimatePresence>
        {buttonState === 'success' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
          >
            <motion.svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                variants={getCheckmarkVariants()}
                initial="hidden"
                animate="visible"
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle glow effect for success state */}
      {buttonState === 'success' && (
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
            zIndex: -1
          }}
        />
      )}
    </motion.div>
  );
}