import { useState } from 'react';
import WorkoutConfig from './components/WorkoutConfig';
import Workout from './components/Workout';
import HistoryPage from './components/HistoryPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { WorkoutRecord } from './types/workout';

type View = 'config' | 'workout' | 'history';

interface WorkoutSettings {
  reps: number;
  workTime: number;
  restTime: number;
}

const App = () => {
  const [view, setView] = useState<View>('config');
  const [settings, setSettings] = useState<WorkoutSettings | null>(null);
  const [history, setHistory] = useLocalStorage<WorkoutRecord[]>('repeater-history', []);

  const handleStartWorkout = (newSettings: WorkoutSettings) => {
    setSettings(newSettings);
    setView('workout');
  };

  const handleFinishWorkout = () => {
    if (view === 'workout' && settings) {
      const newRecord: WorkoutRecord = {
        id: crypto.randomUUID(),
        ...settings,
        date: new Date().toISOString(),
      };
      setHistory([newRecord, ...history]);
    }
    setView('config');
    setSettings(null);
  };

  const handleCancelWorkout = () => {
    setView('config');
    setSettings(null);
  };

  const handleDeleteRecord = (id: string) => {
    setHistory(history.filter(record => record.id !== id));
  };

  if (view === 'workout' && settings) {
    return (
      <Workout 
        reps={settings.reps}
        workTime={settings.workTime}
        restTime={settings.restTime}
        onCancel={handleCancelWorkout}
        onComplete={handleFinishWorkout}
      />
    );
  }

  if (view === 'history') {
    return (
      <HistoryPage 
        history={history} 
        onBack={() => setView('config')} 
        onDelete={handleDeleteRecord}
      />
    );
  }

  return (
    <WorkoutConfig 
      onStart={handleStartWorkout} 
      onOpenHistory={() => setView('history')}
    />
  );
};

export default App;
