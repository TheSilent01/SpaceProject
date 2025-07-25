import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PuzzleLogicProps {
  onComplete: () => void;
}

const PuzzleLogic = ({ onComplete }: PuzzleLogicProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const correctAnswer = '16';
  const sequence = [2, 4, 8, '?'];

  const checkAnswer = () => {
    const normalizedAnswer = userAnswer.trim();
    
    if (normalizedAnswer === correctAnswer) {
      setTimeout(onComplete, 1500);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setShowHint(true);
      }
      setUserAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
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
            RECONFIGURE ARRAY
          </h2>
          <p className="text-lg text-muted-foreground font-space">
            Solve the satellite array sequence to restore communication.
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
              ARRAY CONFIGURATION MATRIX
            </h3>
            
            {/* Sequence Display */}
            <div className="bg-space-medium rounded-lg p-8 mb-6 border border-primary/30">
              <p className="text-lg font-space text-muted-foreground mb-4">
                Complete the sequence pattern:
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                {sequence.map((num, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold font-space
                      ${num === '?' 
                        ? 'border-accent bg-accent/10 text-accent animate-pulse' 
                        : 'border-primary bg-primary/10 text-primary'
                      }`}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>

              <p className="text-sm font-space text-muted-foreground">
                Each number represents a satellite configuration frequency
              </p>
            </div>

            {/* Hint */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6"
              >
                <p className="text-accent font-space text-sm mb-2">PATTERN ANALYSIS:</p>
                <p className="text-accent font-space text-xs">
                  Look at how each number relates to the previous one.
                </p>
                <p className="text-accent font-space text-xs">
                  2 → 4 → 8 → ?
                </p>
                <p className="text-accent font-space text-xs mt-2">
                  Hint: Each number is doubled
                </p>
              </motion.div>
            )}

            {/* Input */}
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Enter the next number..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-space-medium border-primary/30 text-foreground font-space text-center text-lg"
              />
              
              <Button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className="w-full bg-neon-green text-space-dark hover:bg-neon-green/80 font-space text-lg py-3"
              >
                CONFIGURE ARRAY
              </Button>
            </div>

            {attempts > 0 && userAnswer === '' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <p className="text-destructive font-space text-sm">
                  Configuration failed. Recalculate. ({attempts} attempts)
                </p>
              </motion.div>
            )}

            {/* Additional Logic Explanation */}
            <div className="mt-8 bg-space-medium rounded-lg p-4 border border-primary/30">
              <p className="text-xs font-space text-muted-foreground">
                ARRAY STATUS: AWAITING CONFIGURATION
              </p>
              <p className="text-xs font-space text-muted-foreground">
                PATTERN TYPE: MATHEMATICAL SEQUENCE
              </p>
              <p className="text-xs font-space text-muted-foreground">
                DIFFICULTY: BASIC PROGRESSION
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center text-xs text-muted-foreground font-space"
        >
          <p>SATELLITE ARRAY: OFFLINE</p>
          <p>CONFIGURATION: PENDING</p>
          <p>TARGET: ECHO-5 RESTORATION</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PuzzleLogic;