import { Grid, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { CompatibilityItem } from '../lib/aiEngine';

interface CompatibilityMatrixProps {
  items: CompatibilityItem[];
}

export default function CompatibilityMatrix({ items }: CompatibilityMatrixProps) {
  const getStatusColor = (status: CompatibilityItem['status']) => {
    switch (status) {
      case 'Aligned':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-500',
          text: 'text-green-900',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />
        };
      case 'Potential Friction':
        return {
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-500',
          text: 'text-yellow-900',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />
        };
      case 'High Friction':
        return {
          bg: 'from-red-50 to-rose-50',
          border: 'border-red-500',
          text: 'text-red-900',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />
        };
    }
  };

  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Grid className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Compatibility Matrix</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => {
          const colors = getStatusColor(item.status);

          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-5 border-l-4 ${colors.border} hover:shadow-lg smooth-transition`}
            >
              <div className="flex items-start gap-3 mb-3">
                {colors.icon}
                <div>
                  <div className="font-bold text-neutral-900 mb-1">
                    {item.category}
                  </div>
                  <div className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                    {item.status}
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-700 leading-relaxed">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/50">
          <div className="text-sm font-bold text-neutral-900 mb-2">Overall Assessment:</div>
          <div className="text-sm text-neutral-700 leading-relaxed">
            {items.filter(i => i.status === 'High Friction').length > 2
              ? "High friction across multiple areas suggests fundamental communication style differences. Professional guidance may be beneficial."
              : items.filter(i => i.status === 'Aligned').length > 3
              ? "Strong alignment in most areas. The friction points are workable with intentional communication adjustments."
              : "Mixed compatibility. Focus on the high-friction areas first while leveraging strengths in aligned domains."}
          </div>
        </div>
      </div>
    </div>
  );
}
