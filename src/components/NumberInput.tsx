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
  const handleDecrement = () => {
    if (value > min) {
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
      onChange(Math.min(max, value + step));
    }
  };

  return (
    <div className={cn("flex items-center justify-between py-1", className)}>
      <Label className="text-base font-medium">{label}</Label>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full shrink-0"
          onClick={handleDecrement}
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
          className="h-11 w-11 rounded-full shrink-0"
          onClick={handleIncrement}
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
