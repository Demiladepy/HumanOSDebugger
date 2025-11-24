import { Wrench, CheckCircle } from 'lucide-react';
import { RepairStep } from '../lib/analysisEngine';

interface RepairPlaybookProps {
  steps: RepairStep[];
}

export default function RepairPlaybook({ steps }: RepairPlaybookProps) {
  return (
    <div className="glass-effect rounded-[2.5rem] p-10 card-hover">
      <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <span className="text-neutral-900">Repair Playbook</span>
      </h3>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-2xl mb-8">
        <div className="text-sm text-green-900 leading-relaxed font-medium">
          Follow these steps in order. Each one builds on the previous. Skip steps and you will likely fail.
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-16 pb-4 group">
            <div className="absolute left-0 top-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 smooth-transition border-4 border-white z-10">
              {step.step}
            </div>
            {idx < steps.length - 1 && (
              <div className="absolute left-7 top-14 w-0.5 h-full bg-gradient-to-b from-green-200 to-transparent" />
            )}

            <div className="bg-gradient-to-br from-white to-neutral-50 rounded-2xl border border-neutral-200/50 p-6 hover:shadow-xl smooth-transition">
              <div className="font-bold text-neutral-900 mb-4 text-lg">
                {step.action}
              </div>

              <div className="mb-4">
                <div className="text-sm font-bold text-neutral-700 mb-2">Why this matters:</div>
                <div className="text-sm text-neutral-700 bg-neutral-100/50 p-4 rounded-xl leading-relaxed">
                  {step.why}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wide">Expected Outcome:</div>
                  <div className="text-sm text-green-900 leading-relaxed">{step.expected_outcome}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-6 rounded-2xl">
        <div className="text-sm font-bold text-yellow-900 mb-2">Critical Note:</div>
        <div className="text-sm text-yellow-800 leading-relaxed">
          These steps will not work if you are not genuinely willing to change. People can smell performative apologies. Do this only if you actually care about fixing the relationship.
        </div>
      </div>
    </div>
  );
}
