import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { WorkoutRecord } from '@/types/workout';
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

interface HistoryPageProps {
  history: WorkoutRecord[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const HistoryPage = ({ history, onBack, onDelete }: HistoryPageProps) => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col h-dvh bg-background p-6 overflow-hidden">
      <header className="relative flex items-center justify-center py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0"
          onClick={onBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-black tracking-tight">HISTORY</h1>
      </header>

      <main className="flex-1 overflow-y-auto mt-4 space-y-4 pb-6">
        {history.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No workouts recorded yet.</p>
          </div>
        ) : (
          history.map((record) => (
            <Card key={record.id} className="relative overflow-hidden border shadow-sm">
              <div className="absolute top-2 right-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl max-w-[90vw]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete record?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2 mt-4">
                      <AlertDialogCancel className="flex-1 rounded-xl mt-0">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(record.id)} 
                        className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <CardContent className="p-4">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {formatDate(record.date)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-black">{record.reps}</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Reps</div>
                  </div>
                  <div>
                    <div className="text-lg font-black">{record.workTime}s</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Work</div>
                  </div>
                  <div>
                    <div className="text-lg font-black">{record.restTime}s</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Rest</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
