import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PuzzleReflexProps {
  onComplete: () => void;
}

const PuzzleReflex = ({ onComplete }: PuzzleReflexProps) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'success' | 'failed'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [attempts, setAttempts] = useState(0);

  const startGame = useCallback(() => {
    setGameState('ready');
    setReactionTime(null);
    
    // Random delay between 1-3 seconds
    const delay = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      setGameState('go');
      setStartTime(Date.now());
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === 'ready') {
      // Clicked too early
      setGameState('failed');
      setAttempts(prev => prev + 1);
    } else if (gameState === 'go') {
      // Perfect timing
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      setGameState('success');
      
      // Auto-proceed after showing result
      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  }, [gameState, startTime, onComplete]);

  const resetGame = () => {
    setGameState('waiting');
  };

  const getButtonText = () => {
    switch (gameState) {
      case 'waiting':
        return 'START STABILIZATION';
      case 'ready':
        return 'WAIT FOR GREEN...';
      case 'go':
        return 'CLICK NOW!';
      case 'success':
        return `SUCCESS! ${reactionTime}ms`;
      case 'failed':
        return 'TOO SOON!';
      default:
        return 'ERROR';
    }
  };

  const getButtonColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-primary text-primary-foreground hover:bg-primary/80';
      case 'ready':
        return 'bg-destructive text-destructive-foreground cursor-not-allowed';
      case 'go':
        return 'bg-neon-green text-space-dark hover:bg-neon-green/80 animate-pulse';
      case 'success':
        return 'bg-neon-green text-space-dark';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen pt-24 px-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 glow-text">
            STABILIZE THE SHUTTLE
          </h2>
          <p className="text-lg text-muted-foreground font-space">
            React quickly when the system turns green to stabilize the approach.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-card neon-border rounded-lg p-8 mb-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-space text-accent mb-6 glow-text-accent">
              SHUTTLE CONTROL SYSTEM
            </h3>
            
            {/* Main Game Button */}
            <div className="mb-8">
              <motion.div
                className="relative"
                whileHover={{ scale: gameState === 'go' ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={gameState === 'waiting' ? startGame : handleClick}
                  disabled={gameState === 'success'}
                  className={`w-48 h-48 rounded-full text-xl font-space font-bold ${getButtonColor()} neon-border relative overflow-hidden`}
                >
                  {gameState === 'go' && (
                    <motion.div
                      className="absolute inset-0 bg-neon-green/20 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                  <span className="relative z-10">{getButtonText()}</span>
                </Button>
              </motion.div>
            </div>

            {/* Game Instructions */}
            <div className="bg-space-medium rounded-lg p-4 mb-6 border border-primary/30">
              <p className="text-sm font-space text-muted-foreground">
                {gameState === 'waiting' && "Click 'START' to begin the stabilization sequence"}
                {gameState === 'ready' && "Wait for the green signal... Don't click yet!"}
                {gameState === 'go' && "GREEN! Click now!"}
                {gameState === 'success' && `Excellent reflexes! Reaction time: ${reactionTime}ms`}
                {gameState === 'failed' && "Too early! Wait for the green signal."}
              </p>
            </div>

            {/* Reaction Time Display */}
            {reactionTime && gameState === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-4 mb-6"
              >
                <p className="text-neon-green font-space text-lg font-bold">
                  SHUTTLE STABILIZED
                </p>
                <p className="text-neon-green font-space text-sm">
                  Response Time: {reactionTime}ms
                </p>
                <p className="text-neon-green font-space text-xs mt-2">
                  {reactionTime < 300 ? 'EXCEPTIONAL' : 
                   reactionTime < 500 ? 'EXCELLENT' : 
                   reactionTime < 700 ? 'GOOD' : 'ACCEPTABLE'}
                </p>
              </motion.div>
            )}

            {/* Retry Option */}
            {gameState === 'failed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-destructive font-space text-sm">
                  System malfunction! ({attempts} failed attempts)
                </p>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-space-dark font-space"
                >
                  RETRY STABILIZATION
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center text-xs text-muted-foreground font-space"
        >
          <p>SYSTEM STATUS: {gameState.toUpperCase()}</p>
          <p>APPROACH VECTOR: KEPLER-186F</p>
          <p>SHUTTLE: NOVA-7</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PuzzleReflex;