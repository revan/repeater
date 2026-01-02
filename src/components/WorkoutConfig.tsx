import { useLocalStorage } from '@/hooks/useLocalStorage';
import NumberInput from './NumberInput';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, History } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface WorkoutConfigProps {
  onStart: (settings: { reps: number; workTime: number; restTime: number }) => void;
  onOpenHistory: () => void;
}

const WorkoutConfig = ({ onStart, onOpenHistory }: WorkoutConfigProps) => {
  const [reps, setReps] = useLocalStorage('repeater-reps', 5);
  const [workTime, setWorkTime] = useLocalStorage('repeater-work-time', 10);
  const [restTime, setRestTime] = useLocalStorage('repeater-rest-time', 30);

  const totalSeconds = (workTime * reps) + (restTime * (reps - 1));
  
  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-dvh bg-background p-6 overflow-hidden">
      <header className="relative py-4 text-center">
        <h1 className="text-3xl font-black tracking-tight">REPEATER</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onClick={onOpenHistory}
          aria-label="View history"
        >
          <History className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0 space-y-2">
            <div className="bg-card rounded-2xl p-4 border shadow-sm">
              <NumberInput 
                label="Reps" 
                value={reps} 
                onChange={setReps} 
                min={1} 
              />
              <Separator className="my-1" />
              <NumberInput 
                label="Work Time" 
                value={workTime} 
                onChange={setWorkTime} 
                min={1} 
              />
              <Separator className="my-1" />
              <NumberInput 
                label="Rest Time" 
                value={restTime} 
                onChange={setRestTime} 
                min={0} 
              />
            </div>

            <div className="pt-4 text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Total Workout Time
              </span>
              <div className="text-6xl font-black tabular-nums mt-2">
                {formatTime(totalSeconds)}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="max-w-md mx-auto w-full py-4">
        <Button 
          size="lg" 
          className="w-full h-14 text-xl rounded-2xl gap-3 font-bold shadow-lg shadow-primary/20"
          type="button"
          onClick={() => onStart({ reps, workTime, restTime })}
        >
          <Play className="fill-current" />
          START WORKOUT
        </Button>
      </footer>
    </div>
  );
};

export default WorkoutConfig;
