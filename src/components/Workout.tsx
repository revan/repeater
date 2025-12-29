import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface WorkoutProps {
  reps: number;
  workTime: number;
  restTime: number;
  onCancel: () => void;
  onComplete: () => void;
}

type Phase = 'getReady' | 'work' | 'rest' | 'completed';

const Workout = ({ reps, workTime, restTime, onCancel, onComplete }: WorkoutProps) => {
  const [phase, setPhase] = useState<Phase>('getReady');
  const [currentRep, setCurrentRep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3);
  const [totalTime, setTotalTime] = useState(3);
  
  const timerRef = useRef<number | null>(null);

  const vibrate = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, currentRep]);

  // Handle phase transitions and haptics
  useEffect(() => {
    if (timeLeft === 0) {
      if (phase === 'getReady') {
        setPhase('work');
        setTimeLeft(workTime);
        setTotalTime(workTime);
      } else if (phase === 'work') {
        if (currentRep < reps) {
          vibrate(200);
          if (restTime > 0) {
            setPhase('rest');
            setTimeLeft(restTime);
            setTotalTime(restTime);
          } else {
            setCurrentRep((prev) => prev + 1);
            setTimeLeft(workTime);
            setTotalTime(workTime);
          }
        } else {
          vibrate([200, 100, 200, 100, 200]);
          setPhase('completed');
          setTimeout(onComplete, 1500);
        }
      } else if (phase === 'rest') {
        setCurrentRep((prev) => prev + 1);
        setPhase('work');
        setTimeLeft(workTime);
        setTotalTime(workTime);
      }
    }

    // Warning vibrations for last 3 seconds of rest
    if (phase === 'rest' && timeLeft <= 3 && timeLeft > 0) {
      vibrate(50);
    }
  }, [timeLeft, phase, currentRep, reps, workTime, restTime, onComplete]);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const getPhaseLabel = () => {
    switch (phase) {
      case 'getReady': return 'Get Ready';
      case 'work': return 'Work';
      case 'rest': return 'Rest';
      case 'completed': return 'Well Done!';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'getReady': return 'text-amber-500';
      case 'work': return 'text-primary';
      case 'rest': return 'text-emerald-500';
      case 'completed': return 'text-primary';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-11 w-11 rounded-full -ml-2"
              aria-label="Exit workout"
            >
              <X className="h-6 w-6" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl max-w-[90vw]">
            <AlertDialogHeader>
              <AlertDialogTitle>Abandon workout?</AlertDialogTitle>
              <AlertDialogDescription>
                Your progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-2 mt-4">
              <AlertDialogCancel className="flex-1 rounded-xl mt-0">Keep going</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onCancel} 
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Abandon
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="text-xl font-bold tabular-nums">
           {phase !== 'getReady' && phase !== 'completed' && (
             <span>
               Rep <span className="text-2xl">{currentRep}</span> / {reps}
             </span>
           )}
        </div>
        
        <div className="w-11" aria-hidden="true" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="text-center w-full">
            <h2 className={cn(
              "text-2xl font-black uppercase tracking-[0.2em] mb-4 transition-colors duration-500",
              getPhaseColor()
            )}>
                {getPhaseLabel()}
            </h2>
            <div 
              key={phase === 'getReady' ? `${phase}-${timeLeft}` : phase}
              className={cn(
                "font-black leading-none tabular-nums",
                phase === 'getReady' 
                  ? "text-[10rem] animate-in zoom-in duration-300" 
                  : "text-8xl"
              )}
            >
                {timeLeft > 0 ? timeLeft : ''}
            </div>
        </div>

        <div className="w-full max-w-sm px-4">
            <Progress value={progress} className="h-4 rounded-full shadow-inner" />
        </div>
      </main>

      {/* Bottom spacer for layout balance */}
      <footer className="h-16" aria-hidden="true" />
    </div>
  );
};

export default Workout;
