// Enhanced audio generation for Project NOVA with better intro speech

export const generateIntroSpeech = async (text: string): Promise<Blob> => {
  // For a more realistic implementation, you would use a TTS service like:
  // - ElevenLabs API
  // - Google Cloud Text-to-Speech  
  // - Amazon Polly
  // 
  // For now, we'll create a placeholder that you can replace with actual TTS
  
  console.log('Generating intro speech for text:', text);
  
  // This creates a simple tone-based placeholder
  // In production, replace this with actual TTS service call
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 12; // 12 seconds for the full briefing
  
  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Generate speech-like tones with pauses
  const words = text.split(' ');
  const timePerWord = duration / words.length;
  
  for (let i = 0; i < channelData.length; i++) {
    const time = i / sampleRate;
    const wordIndex = Math.floor(time / timePerWord);
    
    // Add pauses between sentences
    const isPause = text.charAt(Math.floor((time / duration) * text.length)) === '.';
    
    if (!isPause && wordIndex < words.length) {
      // Generate speech-like frequency modulation
      const baseFreq = 180 + (wordIndex % 3) * 20; // Vary pitch slightly
      const vibrato = Math.sin(time * 4) * 5; // Add slight vibrato
      const frequency = baseFreq + vibrato;
      
      // Create envelope for more natural sound
      const wordTime = (time % timePerWord) / timePerWord;
      const envelope = Math.sin(wordTime * Math.PI) * 0.15;
      
      // Generate the tone
      channelData[i] = Math.sin(2 * Math.PI * frequency * time) * envelope;
    }
  }
  
  return bufferToWave(buffer);
};

export const generateMorseCode = (text: string): Promise<Blob> => {
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const frequency = 600; // Hz
    const dotDuration = 0.1; // seconds
    const dashDuration = dotDuration * 3;
    const gapDuration = dotDuration;
    const letterGapDuration = dotDuration * 3;

    const morseMap: { [key: string]: string } = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', ' ': ' '
    };

    let totalDuration = 0;
    const morseString = text.toUpperCase().split('').map(char => morseMap[char] || '').join(' ');
    
    // Calculate total duration
    for (let i = 0; i < morseString.length; i++) {
      const char = morseString[i];
      if (char === '.') totalDuration += dotDuration + gapDuration;
      else if (char === '-') totalDuration += dashDuration + gapDuration;
      else if (char === ' ') totalDuration += letterGapDuration;
    }

    const buffer = audioContext.createBuffer(1, totalDuration * sampleRate, sampleRate);
    const channelData = buffer.getChannelData(0);

    let currentTime = 0;
    
    for (let i = 0; i < morseString.length; i++) {
      const char = morseString[i];
      let duration = 0;
      
      if (char === '.') {
        duration = dotDuration;
        generateTone(channelData, currentTime * sampleRate, duration * sampleRate, frequency, sampleRate);
        currentTime += duration + gapDuration;
      } else if (char === '-') {
        duration = dashDuration;
        generateTone(channelData, currentTime * sampleRate, duration * sampleRate, frequency, sampleRate);
        currentTime += duration + gapDuration;
      } else if (char === ' ') {
        currentTime += letterGapDuration;
      }
    }

    const audioBlob = bufferToWave(buffer);
    resolve(audioBlob);
  });
};

const generateTone = (
  channelData: Float32Array,
  startSample: number,
  durationSamples: number,
  frequency: number,
  sampleRate: number
) => {
  for (let i = 0; i < durationSamples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * (startSample + i) / sampleRate) * 0.3;
    if (startSample + i < channelData.length) {
      channelData[startSample + i] = sample;
    }
  }
};

const bufferToWave = (buffer: AudioBuffer): Blob => {
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  const channelData = buffer.getChannelData(0);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);

  // Convert audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
};

// Helper function to download generated audio for manual TTS replacement
export const downloadAudioBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};