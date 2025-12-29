import { useState } from 'react';
import NumberInput from './NumberInput';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const WorkoutConfig = () => {
  const [reps, setReps] = useState(10);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);

  const totalSeconds = (workTime * reps) + (restTime * (reps - 1));
  
  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <header className="py-8 text-center">
        <h1 className="text-3xl font-black tracking-tight">REPEATER</h1>
      </header>

      <main className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0 space-y-4">
            <div className="bg-card rounded-2xl p-4 border shadow-sm">
              <NumberInput 
                label="Reps" 
                value={reps} 
                onChange={setReps} 
                min={1} 
              />
              <Separator className="my-2" />
              <NumberInput 
                label="Work Time" 
                value={workTime} 
                onChange={setWorkTime} 
                min={1} 
              />
              <Separator className="my-2" />
              <NumberInput 
                label="Rest Time" 
                value={restTime} 
                onChange={setRestTime} 
                min={0} 
              />
            </div>

            <div className="pt-8 text-center">
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

      <footer className="max-w-md mx-auto w-full py-8">
        <Button 
          size="lg" 
          className="w-full h-16 text-xl rounded-2xl gap-3 font-bold shadow-lg shadow-primary/20"
          type="button"
        >
          <Play className="fill-current" />
          START WORKOUT
        </Button>
      </footer>
    </div>
  );
};

export default WorkoutConfig;
