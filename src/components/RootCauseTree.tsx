import { GitBranch, Target } from 'lucide-react';
import { RootCauseNode } from '../lib/aiEngine';

interface RootCauseTreeProps {
  tree: RootCauseNode;
}

export default function RootCauseTree({ tree }: RootCauseTreeProps) {
  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <GitBranch className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Root Cause Tree</span>
      </h3>

      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-6 shadow-2xl max-w-md text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-white" />
              <div className="text-xs font-bold text-white uppercase tracking-wide">
                Root Cause
              </div>
            </div>
            <div className="text-xl font-bold text-white leading-tight">
              {tree.root}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-12 bg-gradient-to-b from-emerald-300 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tree.branches.map((branch, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-emerald-200"></div>

              <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border-2 border-emerald-200/50 hover:shadow-lg hover:border-emerald-300 smooth-transition">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-700">
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-800 leading-relaxed font-medium pt-1">
                    {branch.node}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-l-4 border-emerald-500">
          <div className="text-sm font-bold text-emerald-900 mb-2">How to Use This:</div>
          <p className="text-sm text-emerald-800 leading-relaxed">
            The root cause is the core issue driving all surface conflicts. Each branch represents a contributing factor. Address the root, and the branches become easier to manage.
          </p>
        </div>
      </div>
    </div>
  );
}
