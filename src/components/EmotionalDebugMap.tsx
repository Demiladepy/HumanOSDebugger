import { AlertCircle, TrendingUp, UserX } from 'lucide-react';
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
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Root Cause
        </h3>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-900">{misunderstandingRoot}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Emotional Signature</h3>
        <div className="space-y-3">
          {Object.entries(emotionalTone.intensity).map(([emotion, intensity]) => (
            <div key={emotion}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium capitalize">{emotion}</span>
                <span className="text-sm text-gray-500">{intensity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    intensity > 75 ? 'bg-red-500' :
                    intensity > 50 ? 'bg-orange-500' :
                    intensity > 25 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${intensity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserX className="w-5 h-5 text-orange-500" />
          Unmet Emotional Needs
        </h3>
        <div className="space-y-3">
          {unmetNeeds.map((need, idx) => (
            <div key={idx} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <div className="font-medium text-orange-900 capitalize">{need.need}</div>
              <div className="text-sm text-orange-700 mt-1">{need.description}</div>
            </div>
          ))}
          {unmetNeeds.length === 0 && (
            <div className="text-gray-500 text-sm">No critical unmet needs detected</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Escalation Chain
        </h3>
        <div className="space-y-4">
          {escalationChain.map((step, idx) => (
            <div key={idx} className="relative pl-8">
              <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-700">
                {idx + 1}
              </div>
              {idx < escalationChain.length - 1 && (
                <div className="absolute left-3 top-8 w-0.5 h-full bg-blue-200" />
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-900">{step.trigger}</div>
                <div className="text-sm text-gray-600 mt-1">{step.reaction}</div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    step.emotional_state === 'escalating' ? 'bg-red-100 text-red-700' :
                    step.emotional_state === 'defensive' ? 'bg-orange-100 text-orange-700' :
                    step.emotional_state === 'shutdown' ? 'bg-gray-100 text-gray-700' :
                    'bg-green-100 text-green-700'
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
