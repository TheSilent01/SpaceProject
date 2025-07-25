import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FinalScreen = () => {
  const [userName, setUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const generateCertificate = async () => {
    if (!userName.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Wait a moment for the certificate to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (certificateRef.current) {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#0f0f23',
          width: 1024,
          height: 768,
        });
        
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions to fit A4 landscape
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, width, height);
        pdf.save(`NOVA_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
      }
    } catch (error) {
      console.error('Certificate generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen px-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <CheckCircle className="w-24 h-24 text-neon-green mx-auto mb-6 glow-text-success" />
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 glow-text">
            MISSION COMPLETE
          </h2>
          <p className="text-xl text-muted-foreground font-space">
            Echo-5 communication successfully restored!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-card neon-border rounded-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-space text-accent mb-4 glow-text-accent">
              GENERATE YOUR CERTIFICATION
            </h3>
            
            <div className="space-y-4 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-space-medium border-primary/30 text-foreground font-space text-center text-lg"
              />
              
              <Button
                onClick={generateCertificate}
                disabled={!userName.trim() || isGenerating}
                className="w-full bg-neon-green text-space-dark hover:bg-neon-green/80 font-space text-lg py-3"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    DOWNLOAD CERTIFICATE
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Certificate Preview */}
          {userName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div
                ref={certificateRef}
                className="relative w-full max-w-4xl mx-auto bg-space-dark rounded-lg p-8 border-2 border-primary overflow-hidden"
                style={{
                  backgroundImage: 'url(/img/certificate-template.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: '4/3',
                }}
              >
                {/* Certificate overlay */}
                <div className="absolute inset-0 bg-space-dark/70 rounded-lg"></div>
                
                {/* Certificate content */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                  <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-primary glow-text mb-2">
                      PROJECT NOVA
                    </h1>
                    <p className="text-lg font-space text-accent glow-text-accent">
                      SPACE MISSION CERTIFICATION
                    </p>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg font-space text-foreground mb-4">
                      This certifies that
                    </p>
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-green glow-text-success mb-4">
                      {userName.toUpperCase()}
                    </h2>
                    <p className="text-lg font-space text-foreground">
                      has successfully completed the Echo-5 recovery mission
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-orbitron font-bold text-accent glow-text-accent mb-2">
                      CERTIFIED NOVA OPERATIVE
                    </h3>
                    <p className="text-base font-space text-primary">
                      ENSAM MEKNÈS SPACE CLUB
                    </p>
                  </div>

                  <div className="text-sm font-space text-muted-foreground">
                    <p>Mission Date: {new Date().toLocaleDateString()}</p>
                    <p>Certification ID: NOVA-{Date.now().toString().slice(-6)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Success Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-4 text-center"
        >
          <div className="bg-card neon-border rounded-lg p-4">
            <h4 className="font-space text-accent text-sm mb-2">MISSION STATUS</h4>
            <p className="text-neon-green font-space font-bold">SUCCESS</p>
          </div>
          <div className="bg-card neon-border rounded-lg p-4">
            <h4 className="font-space text-accent text-sm mb-2">ECHO-5 STATUS</h4>
            <p className="text-neon-green font-space font-bold">ONLINE</p>
          </div>
          <div className="bg-card neon-border rounded-lg p-4">
            <h4 className="font-space text-accent text-sm mb-2">RECRUIT STATUS</h4>
            <p className="text-neon-green font-space font-bold">CERTIFIED</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-lg text-primary font-space glow-text mb-2">
            Welcome to the ENSAM Space Club!
          </p>
          <p className="text-sm text-muted-foreground font-space">
            Join us for regular missions and space exploration activities.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FinalScreen;