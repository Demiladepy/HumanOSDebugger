import { Brain, Zap } from 'lucide-react';
import { MicroEmotion } from '../lib/aiEngine';

interface MicroEmotionMapProps {
  emotions: MicroEmotion[];
}

export default function MicroEmotionMap({ emotions }: MicroEmotionMapProps) {
  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Micro-Emotion Extractor</span>
      </h3>

      <div className="space-y-4">
        {emotions.map((emotion) => {
          const intensityColor =
            emotion.intensity > 0.75
              ? 'from-red-500 to-rose-500'
              : emotion.intensity > 0.5
              ? 'from-orange-500 to-amber-500'
              : 'from-yellow-400 to-yellow-500';

          return (
            <div
              key={emotion.msgIndex}
              className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/50 hover:shadow-lg smooth-transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-pink-700">
                      #{emotion.msgIndex}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">
                    Message {emotion.msgIndex}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-bold text-neutral-900">
                    {Math.round(emotion.intensity * 100)}%
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${intensityColor} smooth-transition`}
                    style={{ width: `${emotion.intensity * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {emotion.emotions.map((e, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 text-xs font-semibold rounded-full capitalize"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-l-4 border-purple-500">
          <div className="text-sm font-bold text-purple-900 mb-2">Deep Emotional Layer:</div>
          <p className="text-sm text-purple-800 leading-relaxed">
            Micro-emotions are the hidden feelings beneath the surface words. They reveal what's really driving the conflict beyond what's being said explicitly.
          </p>
        </div>
      </div>
    </div>
  );
}
