import { useRef, useEffect, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  className,
}: NumberInputProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valueRef = useRef(value);

  // Keep valueRef in sync with the value prop for use in intervals
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const stopRepeating = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    return () => stopRepeating();
  }, [stopRepeating]);

  const handleAction = useCallback((isIncrement: boolean) => {
    const currentVal = valueRef.current;
    if (isIncrement) {
      if (currentVal < max) {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate(10);
        }
        onChange(Math.min(max, currentVal + step));
      } else {
        stopRepeating();
      }
    } else {
      if (currentVal > min) {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate(10);
        }
        onChange(Math.max(min, currentVal - step));
      } else {
        stopRepeating();
      }
    }
  }, [max, min, onChange, step, stopRepeating]);

  const startRepeating = useCallback((isIncrement: boolean) => {
    stopRepeating();
    handleAction(isIncrement);
    
    // Initial delay before starting repeated action
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleAction(isIncrement);
      }, 100); // Repeat every 100ms
    }, 500); // 500ms initial delay
  }, [handleAction, stopRepeating]);

  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <Label className="text-base font-medium">{label}</Label>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full shrink-0 select-none"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            startRepeating(false);
          }}
          onPointerUp={stopRepeating}
          onPointerLeave={stopRepeating}
          onPointerCancel={stopRepeating}
          onClick={(e) => {
            // Only handle keyboard interactions (where detail is 0)
            // Pointer interactions are handled by onPointerDown
            if (e.detail === 0) {
              handleAction(false);
            }
          }}
          disabled={value <= min}
          type="button"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[3rem] text-center text-2xl font-semibold tabular-nums">
          {value}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full shrink-0 select-none"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            startRepeating(true);
          }}
          onPointerUp={stopRepeating}
          onPointerLeave={stopRepeating}
          onPointerCancel={stopRepeating}
          onClick={(e) => {
            // Only handle keyboard interactions (where detail is 0)
            // Pointer interactions are handled by onPointerDown
            if (e.detail === 0) {
              handleAction(true);
            }
          }}
          disabled={value >= max}
          type="button"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NumberInput;
