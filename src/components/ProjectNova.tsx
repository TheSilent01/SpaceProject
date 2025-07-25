import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from './IntroScreen';
import PuzzleAudio from './PuzzleAudio';
import PuzzleReflex from './PuzzleReflex';
import PuzzleLogic from './PuzzleLogic';
import FinalScreen from './FinalScreen';
import ProgressBar from './ProgressBar';

export type GameState = 'intro' | 'puzzle1' | 'puzzle2' | 'puzzle3' | 'final';

const ProjectNova = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const steps = [
    { id: 'intro', label: 'Mission Brief', completed: false },
    { id: 'puzzle1', label: 'Signal Decode', completed: false },
    { id: 'puzzle2', label: 'Shuttle Control', completed: false },
    { id: 'puzzle3', label: 'Array Config', completed: false },
    { id: 'final', label: 'Certification', completed: false },
  ];

  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => [...prev, stepId]);
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === gameState);
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id as GameState;
      markStepCompleted(gameState);
      setGameState(nextStepId);
    }
  };

  // Background ambient audio
  useEffect(() => {
    // Optional: Add ambient space music here
  }, []);

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden scan-lines">
      {/* Starfield background effect */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Progress bar - hide on intro and final */}
      {gameState !== 'intro' && gameState !== 'final' && (
        <ProgressBar 
          steps={steps} 
          currentStep={gameState} 
          completedSteps={completedSteps} 
        />
      )}

      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <IntroScreen 
                onComplete={nextStep} 
                setIsAudioPlaying={setIsAudioPlaying}
              />
            </motion.div>
          )}

          {gameState === 'puzzle1' && (
            <motion.div
              key="puzzle1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <PuzzleAudio onComplete={nextStep} />
            </motion.div>
          )}

          {gameState === 'puzzle2' && (
            <motion.div
              key="puzzle2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <PuzzleReflex onComplete={nextStep} />
            </motion.div>
          )}

          {gameState === 'puzzle3' && (
            <motion.div
              key="puzzle3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <PuzzleLogic onComplete={nextStep} />
            </motion.div>
          )}

          {gameState === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <FinalScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global audio indicator */}
      {isAudioPlaying && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-card border neon-border rounded-lg p-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs text-primary font-space">AUDIO ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectNova;