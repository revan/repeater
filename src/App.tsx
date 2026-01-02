import { useState, useCallback } from 'react';
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

  const handleStartWorkout = useCallback((newSettings: WorkoutSettings) => {
    setSettings(newSettings);
    setView('workout');
  }, []);

  const handleSaveWorkout = useCallback((): string | undefined => {
    if (view === 'workout' && settings) {
      const id = crypto.randomUUID();
      const newRecord: WorkoutRecord = {
        id,
        ...settings,
        date: new Date().toISOString(),
      };
      setHistory(prev => [newRecord, ...prev]);
      return id;
    }
    return undefined;
  }, [view, settings, setHistory]);

  const handleUpdateNotes = useCallback((id: string, notes: string) => {
    setHistory(prev => prev.map(record => 
      record.id === id ? { ...record, notes } : record
    ));
  }, [setHistory]);

  const handleCancelWorkout = useCallback(() => {
    setView('config');
    setSettings(null);
  }, []);

  const handleDeleteRecord = useCallback((id: string) => {
    setHistory(prev => prev.filter(record => record.id !== id));
  }, [setHistory]);

  const handleOpenHistory = useCallback(() => {
    setView('history');
  }, []);

  const handleBackToConfig = useCallback(() => {
    setView('config');
  }, []);

  if (view === 'workout' && settings) {
    return (
      <Workout 
        reps={settings.reps}
        workTime={settings.workTime}
        restTime={settings.restTime}
        onCancel={handleCancelWorkout}
        onSave={handleSaveWorkout}
        onUpdateNotes={handleUpdateNotes}
      />
    );
  }

  if (view === 'history') {
    return (
      <HistoryPage 
        history={history} 
        onBack={handleBackToConfig} 
        onDelete={handleDeleteRecord}
      />
    );
  }

  return (
    <WorkoutConfig 
      onStart={handleStartWorkout} 
      onOpenHistory={handleOpenHistory}
    />
  );
};

export default App;
