import { useState } from 'react';
import { Zap, TrendingDown, AlertTriangle } from 'lucide-react';
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
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500" />
        Crisis Ripple Simulator
      </h3>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-3">
          See what happens if you take (or don't take) action:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {scenarios.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulate(s)}
              className={`
                p-3 rounded-lg text-left text-sm transition-all
                ${scenario === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {simulation && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-1">Scenario:</div>
            <div className="text-gray-900">{simulation.action}</div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-700 mb-1">Timeline</div>
              <div className="text-lg font-semibold text-blue-900">{simulation.timeline}</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-700 mb-1">Probability</div>
              <div className="text-lg font-semibold text-green-900">{simulation.probability}%</div>
            </div>

            <div className={`rounded-lg p-4 ${
              simulation.repair_difficulty === 'critical' ? 'bg-red-50' :
              simulation.repair_difficulty === 'hard' ? 'bg-orange-50' :
              simulation.repair_difficulty === 'moderate' ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                simulation.repair_difficulty === 'critical' ? 'text-red-700' :
                simulation.repair_difficulty === 'hard' ? 'text-orange-700' :
                simulation.repair_difficulty === 'moderate' ? 'text-yellow-700' : 'text-green-700'
              }`}>
                Repair Difficulty
              </div>
              <div className={`text-lg font-semibold capitalize ${
                simulation.repair_difficulty === 'critical' ? 'text-red-900' :
                simulation.repair_difficulty === 'hard' ? 'text-orange-900' :
                simulation.repair_difficulty === 'moderate' ? 'text-yellow-900' : 'text-green-900'
              }`}>
                {simulation.repair_difficulty}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className={`w-5 h-5 ${
                simulation.trust_impact < 0 ? 'text-red-500' : 'text-green-500'
              }`} />
              <div className="text-sm font-medium text-gray-700">
                Trust Impact: {simulation.trust_impact > 0 ? '+' : ''}{simulation.trust_impact}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  simulation.trust_impact < 0 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.abs(simulation.trust_impact)}%`,
                  marginLeft: simulation.trust_impact < 0 ? `${50 - Math.abs(simulation.trust_impact)}%` : '50%'
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Predicted Outcomes:
            </div>
            <ul className="space-y-2">
              {simulation.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span className="text-gray-700 text-sm">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
