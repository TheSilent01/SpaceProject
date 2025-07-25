import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, SkipForward, Volume2 } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
  setIsAudioPlaying: (playing: boolean) => void;
}

const IntroScreen = ({ onComplete, setIsAudioPlaying }: IntroScreenProps) => {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const briefingText = `Welcome, Cadet. You've been selected for Project NOVA. Our satellite Echo-5 has gone silent in orbit around Kepler-186f. We need your help to restore contact. Time is critical. Proceed with caution.`;

  const playAudio = async () => {
    try {
      // Since we can't generate TTS easily, we'll simulate the audio experience
      setIsPlaying(true);
      setIsAudioPlaying(true);
      setShowTranscription(true);
      
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(false);
        setIsAudioPlaying(false);
        setAudioPlayed(true);
      }, 8000);
      
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
      setIsAudioPlaying(false);
    }
  };

  const skipToMission = () => {
    setAudioPlayed(true);
    setIsPlaying(false);
    setIsAudioPlaying(false);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-8 glitch-text">
            <span className="glow-text">PROJECT</span>
            <br />
            <span className="text-accent glow-text-accent">NOVA</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mb-8"
        >
          <p className="text-xl md:text-2xl text-primary font-space mb-4 glow-text">
            ENSAM MEKNÈS SPACE CLUB
          </p>
          <p className="text-lg text-muted-foreground font-space">
            CLASSIFIED MISSION BRIEFING
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="bg-card neon-border rounded-lg p-8 mb-8 max-w-2xl mx-auto"
        >
          {!showTranscription ? (
            <div className="flex flex-col items-center space-y-6">
              <Volume2 className="w-16 h-16 text-primary glow-text" />
              <p className="text-lg text-muted-foreground font-space">
                Audio briefing ready for playback
              </p>
              
              <Button
                onClick={playAudio}
                disabled={isPlaying}
                className="bg-primary text-primary-foreground hover:bg-primary/80 font-space text-lg px-8 py-4 neon-border"
              >
                {isPlaying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    PLAYING...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    PLAY BRIEFING
                  </>
                )}
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-lg font-space text-accent mb-4 glow-text-accent">
                MISSION BRIEFING TRANSCRIPT
              </h3>
              <motion.p
                className="text-foreground font-space leading-relaxed text-left terminal-cursor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 4 }}
              >
                {briefingText}
              </motion.p>
              
              {isPlaying && (
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center space-x-2 text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-space">AUDIO ACTIVE</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {audioPlayed && (
            <Button
              onClick={onComplete}
              className="bg-neon-green text-space-dark hover:bg-neon-green/80 font-space text-lg px-8 py-4 neon-border pulse-glow"
            >
              BEGIN MISSION
            </Button>
          )}
          
          <Button
            onClick={skipToMission}
            variant="outline"
            className="border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-space-dark font-space"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            SKIP BRIEFING
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="mt-12 text-xs text-muted-foreground font-space"
        >
          <p>SECURITY CLEARANCE: CADET LEVEL</p>
          <p>MISSION STATUS: ACTIVE</p>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroScreen;