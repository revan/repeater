import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
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
  onSave: () => string | undefined;
  onUpdateNotes: (id: string, notes: string) => void;
}

type Phase = 'getReady' | 'work' | 'rest' | 'completed';

const Workout = ({ reps, workTime, restTime, onCancel, onSave, onUpdateNotes }: WorkoutProps) => {
  const [phase, setPhase] = useState<Phase>('getReady');
  const [currentRep, setCurrentRep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3);
  const [totalTime, setTotalTime] = useState(3);
  
  const [notes, setNotes] = useState('');
  const [recordId, setRecordId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  
  const timerRef = useRef<number | null>(null);
  const lastVibratedSecond = useRef<number>(-1);
  const lastPlayedCountdownSecond = useRef<number>(-1);

  // Audio refs
  const audioRefs = useRef<{
    countdown: HTMLAudioElement;
    countdownComplete: HTMLAudioElement;
    repComplete: HTMLAudioElement;
    workoutComplete: HTMLAudioElement;
  } | null>(null);

  useEffect(() => {
    audioRefs.current = {
      countdown: new Audio('/repeater/countdown.wav'),
      countdownComplete: new Audio('/repeater/countdown-complete.wav'),
      repComplete: new Audio('/repeater/rep-complete.wav'),
      workoutComplete: new Audio('/repeater/workout-complete.wav'),
    };
  }, []);

  const playSound = (audio: HTMLAudioElement | undefined) => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Audio playback failed:", err));
    }
  };

  const vibrate = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    const startTime = Date.now();
    const initialTimeLeft = timeLeft;

    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newTimeLeft = Math.max(0, initialTimeLeft - elapsed);
      const currentSecond = Math.ceil(newTimeLeft);

      // Warning vibrations/audio
      const isCountingDown = phase === 'getReady' || (phase === 'rest' && currentSecond <= 3);
      if (isCountingDown && currentSecond > 0) {
        if (lastPlayedCountdownSecond.current !== currentSecond) {
          playSound(audioRefs.current?.countdown);
          lastPlayedCountdownSecond.current = currentSecond;
        }
      } else {
        lastPlayedCountdownSecond.current = -1;
      }

      if (phase === 'rest' && currentSecond <= 3 && currentSecond > 0) {
        if (lastVibratedSecond.current !== currentSecond) {
          vibrate(50);
          lastVibratedSecond.current = currentSecond;
        }
      } else if (phase !== 'rest') {
        lastVibratedSecond.current = -1;
      }

      if (newTimeLeft === 0) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        
        if (phase === 'getReady') {
          playSound(audioRefs.current?.countdownComplete);
          setPhase('work');
          setTimeLeft(workTime);
          setTotalTime(workTime);
        } else if (phase === 'work') {
          if (currentRep < reps) {
            vibrate(200);
            playSound(audioRefs.current?.repComplete);
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
            playSound(audioRefs.current?.workoutComplete);
            setPhase('completed');
            const id = onSave();
            if (id) setRecordId(id);
          }
        } else if (phase === 'rest') {
          playSound(audioRefs.current?.countdownComplete);
          setCurrentRep((prev) => prev + 1);
          setPhase('work');
          setTimeLeft(workTime);
          setTotalTime(workTime);
        }
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 50);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, currentRep, reps, workTime, restTime, onSave]);

  // Debounced notes update
  useEffect(() => {
    if (!recordId || isSaved) return;

    const timeout = setTimeout(() => {
      onUpdateNotes(recordId, notes);
      setIsSaved(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [notes, recordId, onUpdateNotes, isSaved]);

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

  const getPhaseBgColor = () => {
    switch (phase) {
      case 'getReady': return 'bg-amber-500';
      case 'work': return 'bg-primary';
      case 'rest': return 'bg-emerald-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-background p-6 overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center h-16">
        {phase !== 'completed' ? (
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
        ) : (
          <div className="w-11" />
        )}

        <div className="text-xl font-bold tabular-nums">
           {phase !== 'getReady' && phase !== 'completed' && (
             <span>
               Rep <span className="text-2xl">{currentRep}</span> / {reps}
             </span>
           )}
        </div>
        
        <div className="w-11" aria-hidden="true" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center w-full">
            <h2 className={cn(
              "text-2xl font-black uppercase tracking-[0.2em] mb-4 transition-colors duration-500",
              getPhaseColor()
            )}>
                {getPhaseLabel()}
            </h2>
            {phase === 'completed' ? (
              <div className="w-full max-w-sm mx-auto space-y-4 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative">
                  <Textarea
                    placeholder="Add a note..."
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setIsSaved(false);
                    }}
                    className="min-h-[120px] rounded-2xl bg-card border shadow-sm resize-none focus-visible:ring-primary text-base p-4"
                  />
                  {isSaved && notes.trim() !== '' && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-medium text-emerald-500 animate-in fade-in zoom-in duration-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div 
                key={phase === 'getReady' ? `${phase}-${Math.ceil(timeLeft)}` : phase}
                className={cn(
                  "font-black leading-none tabular-nums",
                  phase === 'getReady' 
                    ? "text-8xl animate-in zoom-in duration-300" 
                    : "text-7xl"
                )}
              >
                  {timeLeft > 0 ? Math.ceil(timeLeft) : ''}
              </div>
            )}
        </div>

        {phase !== 'getReady' && phase !== 'completed' && (
          <div className="w-full max-w-sm px-4">
            <Progress 
              value={progress} 
              className="h-4 rounded-full shadow-inner" 
              indicatorClassName={getPhaseBgColor()}
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-sm mx-auto py-4">
        {phase === 'completed' && (
          <Button 
            onClick={onCancel}
            size="lg"
            className="w-full h-14 text-xl rounded-2xl font-bold shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300"
          >
            DONE
          </Button>
        )}
      </footer>
    </div>
  );
};

export default Workout;
