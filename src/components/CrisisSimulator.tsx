import { useState } from 'react';
import { Zap, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import { simulateRippleEffects, RippleOutcome } from '../lib/analysisEngine';

interface CrisisSimulatorProps {
  conflictText: string;
}

export default function CrisisSimulator({ conflictText }: CrisisSimulatorProps) {
  const [scenario, setScenario] = useState('');
  const [simulation, setSimulation] = useState<RippleOutcome | null>(null);

  const scenarios = [
    'What if I ignore them for 3 days?',
    'What if I send a defensive response?',
    'What if I apologize genuinely?',
    'What if I listen without defending myself?'
  ];

  const handleSimulate = (scenarioText: string) => {
    setScenario(scenarioText);
    const result = simulateRippleEffects(conflictText, scenarioText);
    setSimulation(result);
  };

  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Crisis Ripple Simulator</span>
      </h3>

      <div className="mb-6">
        <div className="text-sm text-neutral-600 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Simulate different actions and see their predicted outcomes:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenarios.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulate(s)}
              className={`
                p-4 rounded-2xl text-left text-sm font-medium smooth-transition
                ${scenario === s
                  ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-lg scale-105'
                  : 'bg-gradient-to-br from-neutral-50 to-white hover:from-white hover:to-neutral-50 border border-neutral-200/50 text-neutral-700 hover:shadow-lg hover:scale-105'
                }
              `}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {simulation && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/50">
            <div className="text-sm font-bold text-neutral-700 mb-2">Scenario:</div>
            <div className="text-neutral-900 font-medium">{simulation.action}</div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200/50 hover:shadow-lg smooth-transition">
              <div className="text-sm font-semibold text-blue-700 mb-2">Timeline</div>
              <div className="text-2xl font-bold text-blue-900">{simulation.timeline}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200/50 hover:shadow-lg smooth-transition">
              <div className="text-sm font-semibold text-green-700 mb-2">Probability</div>
              <div className="text-2xl font-bold text-green-900">{simulation.probability}%</div>
            </div>

            <div className={`rounded-2xl p-5 border-2 hover:shadow-lg smooth-transition ${
              simulation.repair_difficulty === 'critical' ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50' :
              simulation.repair_difficulty === 'hard' ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50' :
              simulation.repair_difficulty === 'moderate' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200/50' :
              'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
            }`}>
              <div className={`text-sm font-semibold mb-2 ${
                simulation.repair_difficulty === 'critical' ? 'text-red-700' :
                simulation.repair_difficulty === 'hard' ? 'text-orange-700' :
                simulation.repair_difficulty === 'moderate' ? 'text-yellow-700' : 'text-green-700'
              }`}>
                Repair Difficulty
              </div>
              <div className={`text-2xl font-bold capitalize ${
                simulation.repair_difficulty === 'critical' ? 'text-red-900' :
                simulation.repair_difficulty === 'hard' ? 'text-orange-900' :
                simulation.repair_difficulty === 'moderate' ? 'text-yellow-900' : 'text-green-900'
              }`}>
                {simulation.repair_difficulty}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-200/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className={`w-6 h-6 ${
                simulation.trust_impact < 0 ? 'text-red-500' : 'text-green-500'
              }`} />
              <div className="text-base font-bold text-neutral-900">
                Trust Impact: {simulation.trust_impact > 0 ? '+' : ''}{simulation.trust_impact}
              </div>
            </div>
            <div className="relative w-full h-4 bg-neutral-200 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-full bg-neutral-400"></div>
              </div>
              <div
                className={`h-full rounded-full smooth-transition ${
                  simulation.trust_impact < 0 ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{
                  width: `${Math.abs(simulation.trust_impact)}%`,
                  marginLeft: simulation.trust_impact < 0 ? `${50 - Math.abs(simulation.trust_impact)}%` : '50%'
                }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-l-4 border-orange-500">
            <div className="font-bold text-orange-900 mb-4 flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5" />
              Predicted Outcomes:
            </div>
            <ul className="space-y-3">
              {simulation.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-orange-500 mr-3 font-bold">•</span>
                  <span className="text-orange-900 text-sm leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
