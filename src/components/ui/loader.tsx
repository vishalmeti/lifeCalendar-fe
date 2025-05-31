import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  text?: string;
  variant?: 'spinner' | 'pulse' | 'dots';
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  text,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
    xl: 'w-24 h-24 border-[8px]',
    xxl: 'w-32 h-32 border-[10px]',
    xxxl: 'w-40 h-40 border-[12px]',
  };
  
  const gridSizeClasses = {
    sm: 'w-16 h-16 gap-1',
    md: 'w-24 h-24 gap-1.5',
    lg: 'w-32 h-32 gap-2',
    xl: 'w-40 h-40 gap-2.5',
    xxl: 'w-48 h-48 gap-3',
    xxxl: 'w-56 h-56 gap-3.5',
  };
  
  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5 gap-2',
    md: 'w-3 h-3 gap-3',
    lg: 'w-4 h-4 gap-4',
    xl: 'w-5 h-5 gap-5',
    xxl: 'w-6 h-6 gap-6',
    xxxl: 'w-8 h-8 gap-8',
  };

  const lottieSizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
    xxl: 'w-48 h-48',
    xxxl: 'w-56 h-56',
  };

  const renderLoader = () => {
    switch(variant) {
      case 'pulse':
        return (
          <div className={`grid grid-cols-3 grid-rows-3 ${gridSizeClasses[size]}`}>
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="rounded-md bg-primary"
                animate={{ 
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                  repeatType: "loop",
                  times: [0, 0.5, 1]
                }}
              />
            ))}
          </div>
        );
        
      case 'dots':
        return (
          <div className="flex items-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`${dotSizeClasses[size].split(' ').slice(0, 2).join(' ')} mx-1 rounded-full bg-primary`}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                  repeatType: "loop",
                  times: [0, 0.5, 1]
                }}
              />
            ))}
          </div>
        );
        
      case 'spinner':
      default:
        return (
          <div className="relative">
            <motion.div
              className={`
                ${sizeClasses[size]}
                rounded-full
                border-primary/20
                border-t-primary
                absolute
                top-0
                left-0
              `}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                ease: 'linear',
                duration: 1,
              }}
            />
            <div className={`${sizeClasses[size]} invisible`} aria-hidden="true"></div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoader()}
      {text && (
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: "loop",
            times: [0, 0.5, 1]
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
