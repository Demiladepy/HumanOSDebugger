import { useState } from 'react';
import { Wrench, MessageSquare, XCircle, Clock, Target } from 'lucide-react';
import { generateRepairPlaybook, RepairPlaybook as RepairPlaybookType } from '../lib/aiEngine';

interface DynamicRepairPlaybookProps {
  conflictText: string;
}

export default function DynamicRepairPlaybook({ conflictText }: DynamicRepairPlaybookProps) {
  const [tone, setTone] = useState<'apologetic' | 'assertive' | 'vulnerable' | 'collaborative'>('apologetic');
  const [playbook, setPlaybook] = useState<RepairPlaybookType | null>(null);
  const [loading, setLoading] = useState(false);

  const tones = [
    { value: 'apologetic' as const, label: 'Apologetic', color: 'from-green-500 to-emerald-500' },
    { value: 'assertive' as const, label: 'Assertive', color: 'from-blue-500 to-cyan-500' },
    { value: 'vulnerable' as const, label: 'Vulnerable', color: 'from-pink-500 to-rose-500' },
    { value: 'collaborative' as const, label: 'Collaborative', color: 'from-violet-500 to-purple-500' }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateRepairPlaybook(conflictText, tone);
    setPlaybook(result);
    setLoading(false);
  };

  return (
    <div className="glass-effect rounded-[2.5rem] p-10 card-hover">
      <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <span className="text-neutral-900">Dynamic Repair Playbook</span>
      </h3>

      <div className="space-y-6 mb-8">
        <div>
          <label className="text-sm font-bold text-neutral-700 mb-4 block">Select Communication Tone</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`p-4 rounded-2xl font-semibold smooth-transition ${
                  tone === t.value
                    ? `bg-gradient-to-br ${t.color} text-white shadow-lg scale-105`
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-105'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-semibold smooth-transition ${
            !loading
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              : 'bg-neutral-200 text-neutral-400 cursor-wait'
          }`}
        >
          {loading ? 'Generating Playbook...' : 'Generate Repair Strategy'}
        </button>
      </div>

      {playbook && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div className="text-sm font-bold text-green-900">Sample Messages</div>
            </div>
            <div className="space-y-3">
              {playbook.sample_messages.map((msg, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-green-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-neutral-800 leading-relaxed pt-1">
                      {msg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <div className="text-sm font-bold text-red-900">What to Avoid</div>
            </div>
            <ul className="space-y-2">
              {playbook.avoid.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-red-800">
                  <span className="text-red-500 font-bold mt-0.5">✗</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="text-sm font-bold text-blue-900">Best Timing</div>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                {playbook.timing}
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border-l-4 border-violet-500">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-violet-600" />
                <div className="text-sm font-bold text-violet-900">Expected Response</div>
              </div>
              <p className="text-sm text-violet-800 leading-relaxed">
                {playbook.expected_response}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-l-4 border-yellow-500">
            <div className="text-sm font-bold text-yellow-900 mb-2">Important Note:</div>
            <p className="text-sm text-yellow-800 leading-relaxed">
              These messages are templates. Adapt them to your authentic voice and specific situation. Scripted apologies feel fake—let these guide your intention, not your exact words.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
