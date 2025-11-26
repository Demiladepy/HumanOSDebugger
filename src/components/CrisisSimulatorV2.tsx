import { useState } from 'react';
import { Zap, TrendingDown, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { simulateCrisis, CrisisSimulation } from '../lib/aiEngine';

interface CrisisSimulatorV2Props {
  conflictText: string;
}

export default function CrisisSimulatorV2({ conflictText }: CrisisSimulatorV2Props) {
  const [intensity, setIntensity] = useState(50);
  const [action, setAction] = useState('');
  const [simulation, setSimulation] = useState<CrisisSimulation | null>(null);

  const actions = [
    'Apologize genuinely and take accountability',
    'Ignore and give them space for 3 days',
    'Send a defensive explanation',
    'Listen without defending or explaining',
    'Request a structured conversation',
    'Send a vulnerable message about feelings'
  ];

  const handleSimulate = async () => {
    if (!action) return;
    const result = await simulateCrisis(conflictText, intensity, action);
    setSimulation(result);
  };

  return (
    <div className="glass-effect rounded-[2.5rem] p-10 card-hover">
      <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <span className="text-neutral-900">Crisis Ripple Simulator 2.0</span>
      </h3>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-sm font-bold text-neutral-700">Conflict Intensity</label>
            <span className="text-sm font-bold text-neutral-900">{intensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #ef4444 ${intensity}%, #e5e7eb ${intensity}%, #e5e7eb 100%)`
            }}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700 mb-3 block">Select Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-neutral-200/50 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-neutral-900 font-medium smooth-transition"
          >
            <option value="">Choose an action...</option>
            {actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSimulate}
          disabled={!action}
          className={`w-full py-4 rounded-2xl font-semibold smooth-transition ${
            action
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Simulate Outcome
        </button>
      </div>

      {simulation && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`rounded-2xl p-5 border-2 ${
              simulation.trust_change >= 0
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {simulation.trust_change >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <div className="text-xs font-bold uppercase tracking-wide text-neutral-700">
                  Trust
                </div>
              </div>
              <div className={`text-2xl font-bold ${
                simulation.trust_change >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {simulation.trust_change > 0 ? '+' : ''}{(simulation.trust_change * 100).toFixed(0)}%
              </div>
            </div>

            <div className={`rounded-2xl p-5 border-2 ${
              simulation.safety_change >= 0
                ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50'
                : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {simulation.safety_change >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                )}
                <div className="text-xs font-bold uppercase tracking-wide text-neutral-700">
                  Safety
                </div>
              </div>
              <div className={`text-2xl font-bold ${
                simulation.safety_change >= 0 ? 'text-blue-900' : 'text-orange-900'
              }`}>
                {simulation.safety_change > 0 ? '+' : ''}{(simulation.safety_change * 100).toFixed(0)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 border-2 border-yellow-200/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div className="text-xs font-bold uppercase tracking-wide text-neutral-700">
                  Escalation Risk
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                {(simulation.risk_of_escalation * 100).toFixed(0)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border-2 border-violet-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-violet-600" />
                <div className="text-xs font-bold uppercase tracking-wide text-neutral-700">
                  Success Rate
                </div>
              </div>
              <div className="text-2xl font-bold text-violet-900">
                {(simulation.overall_success_probability * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-sm font-bold text-blue-900">Expected Timeline</div>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {simulation.timeline}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-500">
            <div className="text-sm font-bold text-purple-900 mb-2">Interpretation:</div>
            <p className="text-sm text-purple-800 leading-relaxed">
              {simulation.overall_success_probability > 0.6
                ? "This action has a strong chance of improving the situation. The predicted changes suggest movement toward resolution."
                : simulation.overall_success_probability > 0.4
                ? "This action carries moderate risk. Results will depend heavily on timing and delivery."
                : "High risk of making things worse. Consider alternative approaches or waiting for a better moment."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
