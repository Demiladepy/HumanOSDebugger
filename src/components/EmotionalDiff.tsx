import { GitCompare, TrendingDown, TrendingUp } from 'lucide-react';
import { EmotionalDiff as EmotionalDiffType } from '../lib/aiEngine';

interface EmotionalDiffProps {
  diff: EmotionalDiffType;
}

export default function EmotionalDiff({ diff }: EmotionalDiffProps) {
  const metrics = [
    { key: 'trust', label: 'Trust', value: diff.trust },
    { key: 'safety', label: 'Emotional Safety', value: diff.safety },
    { key: 'clarity', label: 'Clarity', value: diff.clarity },
    { key: 'intention', label: 'Perceived Intention', value: diff.intention }
  ];

  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <GitCompare className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Emotional Diff Checker</span>
      </h3>

      <div className="space-y-5">
        {metrics.map((metric) => {
          const isPositive = metric.value > 0;
          const isNeutral = Math.abs(metric.value) < 0.05;
          const percentage = Math.abs(metric.value * 100);

          return (
            <div key={metric.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-700">
                    {metric.label}
                  </span>
                  {!isNeutral && (
                    isPositive ? (
                      <TrendingUp className="w-4 h-4 text-cyan-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )
                  )}
                </div>
                <span className={`text-sm font-bold ${
                  isPositive ? 'text-cyan-600' : isNeutral ? 'text-neutral-500' : 'text-red-600'
                }`}>
                  {isPositive ? '+' : ''}{metric.value.toFixed(2)}
                </span>
              </div>

              <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-neutral-400"></div>
                </div>
                <div
                  className={`h-full rounded-full smooth-transition ${
                    isPositive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : 'bg-gradient-to-r from-red-500 to-rose-500'
                  }`}
                  style={{
                    width: `${percentage}%`,
                    marginLeft: isPositive ? '50%' : `${50 - percentage}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-l-4 border-cyan-500">
          <div className="text-sm font-bold text-cyan-900 mb-2">Interpretation:</div>
          <div className="text-sm text-cyan-800 leading-relaxed">
            {diff.trust < 0 || diff.safety < 0
              ? "This conversation decreased trust and emotional safety. Repair work is needed to restore the foundation."
              : diff.clarity > 0
              ? "While emotions ran high, this conversation increased clarity about the issue."
              : "The conversation was emotionally neutral but may not have moved toward resolution."}
          </div>
        </div>
      </div>
    </div>
  );
}
