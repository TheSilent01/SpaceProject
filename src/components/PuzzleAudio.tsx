import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { generateMorseCode } from '@/utils/audioGenerator';

interface PuzzleAudioProps {
  onComplete: () => void;
}

const PuzzleAudio = ({ onComplete }: PuzzleAudioProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const correctAnswer = 'ENSAM SPACE CLUB';
  const morseDisplay = '. -. ... .- --   ... .--. .- -.-. .   -.-. .-.. ..- -...';

  useEffect(() => {
    // Generate Morse code audio on component mount
    generateMorseCode(correctAnswer).then(blob => {
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    });

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const checkAnswer = () => {
    const normalizedAnswer = userAnswer.trim().toUpperCase();
    const normalizedCorrect = correctAnswer.toUpperCase();

    if (normalizedAnswer === normalizedCorrect) {
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
            DECODE THE SIGNAL
          </h2>
          <p className="text-lg text-muted-foreground font-space">
            Echo-5 is transmitting a coded message. Decode it to proceed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-card neon-border rounded-lg p-8 mb-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-space text-accent mb-4 glow-text-accent">
              INCOMING TRANSMISSION
            </h3>
            
            {/* Audio Player */}
            <div className="bg-space-medium rounded-lg p-6 mb-6 border border-primary/30">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  onClick={playAudio}
                  disabled={!audioUrl}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 font-space"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  onClick={resetAudio}
                  disabled={!audioUrl}
                  variant="outline"
                  className="border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-space-dark"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              )}

              {isPlaying && (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2 text-primary animate-pulse">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-space ml-2">DECODING...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hint */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6"
              >
                <p className="text-accent font-space text-sm mb-2">TRANSMISSION PATTERN:</p>
                <code className="text-accent font-space text-xs block break-all">
                  {morseDisplay}
                </code>
                <p className="text-accent font-space text-xs mt-2">
                  • = short signal, - = long signal
                </p>
              </motion.div>
            )}

            {/* Input */}
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter decoded message..."
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
                SUBMIT DECODE
              </Button>
            </div>

            {attempts > 0 && userAnswer === '' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <p className="text-destructive font-space text-sm">
                  Incorrect decode. Try again. ({attempts} attempts)
                </p>
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
          <p>SIGNAL STRENGTH: WEAK</p>
          <p>ENCRYPTION: MORSE CODE</p>
          <p>SOURCE: ECHO-5 SATELLITE</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PuzzleAudio;