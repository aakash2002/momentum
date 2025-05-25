import { Progress } from '@/components/ui/progress';

export default function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full max-w-2xl text-center">
      <div className="mb-2 text-sm text-gray-300">
        {completed} of {total} tasks completed ({percent}%)
      </div>
      <Progress value={percent} className="h-3 bg-white/10" />
    </div>
  );
}
