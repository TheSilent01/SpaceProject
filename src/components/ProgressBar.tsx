import { motion } from 'framer-motion';

interface Step {
  id: string;
  label: string;
  completed: boolean;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
}

const ProgressBar = ({ steps, currentStep, completedSteps }: ProgressBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-sm border-b border-primary/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isActive = isCompleted || isCurrent;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
                      ${isCompleted 
                        ? 'bg-neon-green border-neon-green text-space-dark' 
                        : isCurrent 
                        ? 'bg-primary border-primary text-space-dark animate-pulse' 
                        : 'border-muted text-muted-foreground'
                      }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isActive ? 1 : 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </motion.div>
                  <span className={`text-xs mt-1 font-space ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <motion.div
                    className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-neon-green' : 'bg-muted'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0.3 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;