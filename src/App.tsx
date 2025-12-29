import { useState } from 'react';
import WorkoutConfig from './components/WorkoutConfig';
import Workout from './components/Workout';

type View = 'config' | 'workout';

interface WorkoutSettings {
  reps: number;
  workTime: number;
  restTime: number;
}

const App = () => {
  const [view, setView] = useState<View>('config');
  const [settings, setSettings] = useState<WorkoutSettings | null>(null);

  const handleStartWorkout = (newSettings: WorkoutSettings) => {
    setSettings(newSettings);
    setView('workout');
  };

  const handleFinishWorkout = () => {
    setView('config');
    setSettings(null);
  };

  if (view === 'workout' && settings) {
    return (
      <Workout 
        reps={settings.reps}
        workTime={settings.workTime}
        restTime={settings.restTime}
        onCancel={handleFinishWorkout}
        onComplete={handleFinishWorkout}
      />
    );
  }

  return <WorkoutConfig onStart={handleStartWorkout} />;
};

export default App;
