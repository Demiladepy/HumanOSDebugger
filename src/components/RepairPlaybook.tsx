import { Wrench, CheckCircle } from 'lucide-react';
import { RepairStep } from '../lib/analysisEngine';

interface RepairPlaybookProps {
  steps: RepairStep[];
}

export default function RepairPlaybook({ steps }: RepairPlaybookProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wrench className="w-5 h-5 text-green-500" />
        Repair Playbook
      </h3>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
        <div className="text-sm text-green-900">
          Follow these steps in order. Each one builds on the previous. Skip steps and you'll likely fail.
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-12 pb-6">
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              {step.step}
            </div>
            {idx < steps.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-full bg-green-200" />
            )}

            <div className="bg-white rounded-lg border-2 border-gray-200 p-5">
              <div className="font-semibold text-gray-900 mb-2 text-lg">
                {step.action}
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-gray-600 mb-1">Why this matters:</div>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {step.why}
                </div>
              </div>

              <div className="flex items-start gap-2 bg-green-50 p-3 rounded">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-green-700 mb-1">Expected Outcome:</div>
                  <div className="text-sm text-green-800">{step.expected_outcome}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <div className="text-sm font-medium text-yellow-900 mb-1">Critical Note:</div>
        <div className="text-sm text-yellow-800">
          These steps won't work if you're not genuinely willing to change. People can smell performative apologies. Do this only if you actually care about fixing the relationship.
        </div>
      </div>
    </div>
  );
}
