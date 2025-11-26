import { Activity, TrendingUp } from 'lucide-react';
import { EmotionalTimelinePoint } from '../lib/aiEngine';

interface EmotionalHeatmapProps {
  timeline: EmotionalTimelinePoint[];
}

export default function EmotionalHeatmap({ timeline }: EmotionalHeatmapProps) {
  const maxIntensity = Math.max(...timeline.map(t => t.intensity));

  const emotionColors: Record<string, string> = {
    anger: 'bg-red-500',
    hurt: 'bg-rose-500',
    anxiety: 'bg-yellow-500',
    defensiveness: 'bg-orange-500',
    sadness: 'bg-blue-500',
    frustration: 'bg-amber-500'
  };

  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Emotional Heatmap Timeline</span>
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {timeline.map((point) => (
            <div key={point.msg} className="flex items-center gap-4">
              <div className="w-16 text-sm font-bold text-neutral-700">
                Msg {point.msg}
              </div>

              <div className="flex-1 bg-neutral-100 rounded-full h-10 overflow-hidden relative">
                <div
                  className={`h-full smooth-transition ${emotionColors[point.emotion] || 'bg-neutral-400'}`}
                  style={{ width: `${(point.intensity / maxIntensity) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center px-4">
                  <span className="text-sm font-semibold text-white drop-shadow-lg capitalize">
                    {point.emotion}
                  </span>
                </div>
              </div>

              <div className="w-16 text-right">
                <span className="text-sm font-bold text-neutral-900">
                  {Math.round(point.intensity * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">Emotion Legend</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(emotionColors).map(([emotion, color]) => (
              <div key={emotion} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${color}`} />
                <span className="text-sm text-neutral-700 capitalize">{emotion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
