import { useEffect, useState } from 'react';

const AdmissionCover = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation at 5.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4500);

    // Complete and call onComplete at 6 seconds
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black text-white overflow-hidden transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-conic from-cyan-400 via-purple-500 to-pink-500 animate-spin-slow"></div>
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-float-random"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Morphing Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-20 animate-morph-shape"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-400 to-blue-500 opacity-25 animate-morph-reverse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-r from-yellow-400 to-cyan-500 opacity-30 animate-morph-bounce"></div>
      </div>

      {/* Lightning Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40 animate-lightning-flash"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-50 animate-lightning-flash-delay"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Logo/Title with 3D Effect */}
        <div className="mb-8 perspective-1000">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-title-glow transform-gpu">
            ADMISSION PORTAL
          </h1>
          <div className="mt-6 h-2 w-48 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 mx-auto animate-pulse-bar rounded-full shadow-lg shadow-purple-500/50"></div>
        </div>

        {/* Subtitle with Typewriter Effect */}
        <p className="text-xl md:text-2xl text-gray-200 mb-16 max-w-lg animate-typewriter font-light">
          Unlock Your Future • Transform Your Destiny
        </p>

        {/* Enhanced Loading Animation */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce-sync shadow-lg shadow-cyan-400/50"></div>
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce-sync delay-100 shadow-lg shadow-purple-400/50"></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce-sync delay-200 shadow-lg shadow-pink-400/50"></div>
        </div>

        {/* Progress Bar with Glow */}
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 rounded-full animate-progress shadow-lg shadow-purple-500/50"></div>
        </div>

        {/* Energy Orb */}
        <div className="mt-12 w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-orb-pulse shadow-2xl shadow-purple-500/50"></div>
      </div>

      {/* Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float-random {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.6;
          }
          33% { 
            transform: translateY(-20px) translateX(10px) scale(1.2); 
            opacity: 1;
          }
          66% { 
            transform: translateY(10px) translateX(-15px) scale(0.8); 
            opacity: 0.4;
          }
        }
        
        @keyframes morph-shape {
          0%, 100% { 
            border-radius: 50% 50% 50% 50%;
            transform: rotate(0deg) scale(1);
          }
          25% { 
            border-radius: 60% 40% 30% 70%;
            transform: rotate(90deg) scale(1.2);
          }
          50% { 
            border-radius: 30% 70% 70% 30%;
            transform: rotate(180deg) scale(0.8);
          }
          75% { 
            border-radius: 70% 30% 50% 50%;
            transform: rotate(270deg) scale(1.1);
          }
        }
        
        @keyframes morph-reverse {
          0%, 100% { 
            border-radius: 40% 60% 70% 30%;
            transform: rotate(360deg) scale(1);
          }
          50% { 
            border-radius: 70% 30% 40% 60%;
            transform: rotate(180deg) scale(1.3);
          }
        }
        
        @keyframes morph-bounce {
          0%, 100% { 
            border-radius: 50%;
            transform: scale(1) translateY(0px);
          }
          50% { 
            border-radius: 20% 80% 60% 40%;
            transform: scale(1.4) translateY(-30px);
          }
        }
        
        @keyframes lightning-flash {
          0%, 90%, 100% { opacity: 0; }
          5%, 10% { opacity: 1; }
        }
        
        @keyframes lightning-flash-delay {
          0%, 70%, 100% { opacity: 0; }
          75%, 80% { opacity: 1; }
        }
        
        @keyframes title-glow {
          0%, 100% { 
            filter: brightness(1) saturate(1);
            text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
            transform: scale(1);
          }
          50% { 
            filter: brightness(1.3) saturate(1.2);
            text-shadow: 0 0 50px rgba(139, 92, 246, 0.8), 0 0 80px rgba(34, 197, 94, 0.6);
            transform: scale(1.02);
          }
        }
        
        @keyframes typewriter {
          0% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 0.7; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        
        @keyframes bounce-sync {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            box-shadow: 0 0 20px currentColor;
          }
          50% { 
            transform: translateY(-15px) scale(1.1); 
            box-shadow: 0 0 30px currentColor;
          }
        }
        
        @keyframes pulse-bar {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(34, 197, 94, 0.6);
          }
        }
        
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        @keyframes orb-pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
          }
          50% { 
            transform: scale(1.2);
            box-shadow: 0 0 50px rgba(139, 92, 246, 0.8), 0 0 80px rgba(34, 197, 94, 0.6);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-float-random {
          animation: float-random 4s ease-in-out infinite;
        }
        
        .animate-morph-shape {
          animation: morph-shape 6s ease-in-out infinite;
        }
        
        .animate-morph-reverse {
          animation: morph-reverse 7s ease-in-out infinite;
        }
        
        .animate-morph-bounce {
          animation: morph-bounce 4s ease-in-out infinite;
        }
        
        .animate-lightning-flash {
          animation: lightning-flash 3s ease-in-out infinite;
        }
        
        .animate-lightning-flash-delay {
          animation: lightning-flash-delay 4s ease-in-out infinite;
        }
        
        .animate-title-glow {
          animation: title-glow 3s ease-in-out infinite;
        }
        
        .animate-typewriter {
          animation: typewriter 2s ease-out 0.5s both;
        }
        
        .animate-bounce-sync {
          animation: bounce-sync 1.5s ease-in-out infinite;
        }
        
        .animate-pulse-bar {
          animation: pulse-bar 2s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 4s ease-out;
        }
        
        .animate-orb-pulse {
          animation: orb-pulse 2s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};
export default AdmissionCover;