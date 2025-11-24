import { AlertCircle, TrendingUp, UserX, Activity } from 'lucide-react';
import { EmotionalTone, UnmetNeed, EscalationStep } from '../lib/analysisEngine';

interface EmotionalDebugMapProps {
  emotionalTone: EmotionalTone;
  unmetNeeds: UnmetNeed[];
  escalationChain: EscalationStep[];
  misunderstandingRoot: string;
}

export default function EmotionalDebugMap({
  emotionalTone,
  unmetNeeds,
  escalationChain,
  misunderstandingRoot
}: EmotionalDebugMapProps) {
  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8 card-hover">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-neutral-900">Root Cause</span>
        </h3>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-red-500 p-6 rounded-2xl">
          <p className="text-red-900 text-base leading-relaxed font-medium">{misunderstandingRoot}</p>
        </div>
      </div>

      <div className="glass-effect rounded-3xl p-8 card-hover">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-neutral-900">Emotional Signature</span>
        </h3>
        <div className="space-y-5">
          {Object.entries(emotionalTone.intensity).map(([emotion, intensity]) => (
            <div key={emotion} className="group">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold capitalize text-neutral-700 group-hover:text-neutral-900 smooth-transition">{emotion}</span>
                <span className="text-sm font-bold text-neutral-900">{intensity}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full smooth-transition shadow-lg ${
                    intensity > 75 ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                    intensity > 50 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                    intensity > 25 ? 'bg-gradient-to-r from-yellow-400 to-amber-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  style={{ width: `${intensity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-effect rounded-3xl p-8 card-hover">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <UserX className="w-5 h-5 text-white" />
          </div>
          <span className="text-neutral-900">Unmet Emotional Needs</span>
        </h3>
        <div className="space-y-4">
          {unmetNeeds.map((need, idx) => (
            <div key={idx} className="bg-gradient-to-br from-orange-50 to-amber-50 border-l-4 border-orange-500 p-5 rounded-2xl hover:shadow-lg smooth-transition">
              <div className="font-bold text-orange-900 capitalize mb-2 text-base">{need.need}</div>
              <div className="text-sm text-orange-800 leading-relaxed">{need.description}</div>
            </div>
          ))}
          {unmetNeeds.length === 0 && (
            <div className="text-neutral-500 text-sm text-center py-4">No critical unmet needs detected</div>
          )}
        </div>
      </div>

      <div className="glass-effect rounded-3xl p-8 card-hover">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-neutral-900">Escalation Chain</span>
        </h3>
        <div className="space-y-5">
          {escalationChain.map((step, idx) => (
            <div key={idx} className="relative pl-12 group">
              <div className="absolute left-0 top-2 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 border-4 border-white shadow-lg flex items-center justify-center text-sm font-bold text-white group-hover:scale-110 smooth-transition z-10">
                {idx + 1}
              </div>
              {idx < escalationChain.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-blue-200 to-transparent" />
              )}
              <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/50 hover:shadow-lg smooth-transition">
                <div className="text-sm font-bold text-neutral-900 mb-2">{step.trigger}</div>
                <div className="text-sm text-neutral-700 mb-3 leading-relaxed">{step.reaction}</div>
                <div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                    step.emotional_state === 'escalating' ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700' :
                    step.emotional_state === 'defensive' ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700' :
                    step.emotional_state === 'shutdown' ? 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700' :
                    'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                  }`}>
                    {step.emotional_state}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
