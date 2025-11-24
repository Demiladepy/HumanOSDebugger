import { MessageSquare, GitCompare, Zap } from 'lucide-react';
import { CommunicationDialect, DialectMismatch } from '../lib/analysisEngine';

interface CommunicationAnalysisProps {
  dialects: CommunicationDialect;
  mismatches: DialectMismatch[];
}

export default function CommunicationAnalysis({ dialects, mismatches }: CommunicationAnalysisProps) {
  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8 card-hover">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-neutral-900">Communication Dialects</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200/50 hover:shadow-lg smooth-transition">
            <div className="font-bold text-blue-900 mb-3 text-lg">Person A</div>
            <div className="text-sm font-semibold text-blue-700 mb-4 capitalize bg-white/50 px-3 py-2 rounded-xl inline-block">
              {dialects.person1.style} Communicator
            </div>
            <ul className="space-y-2">
              {dialects.person1.traits.map((trait, idx) => (
                <li key={idx} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="leading-relaxed">{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200/50 hover:shadow-lg smooth-transition">
            <div className="font-bold text-emerald-900 mb-3 text-lg">Person B</div>
            <div className="text-sm font-semibold text-emerald-700 mb-4 capitalize bg-white/50 px-3 py-2 rounded-xl inline-block">
              {dialects.person2.style} Communicator
            </div>
            <ul className="space-y-2">
              {dialects.person2.traits.map((trait, idx) => (
                <li key={idx} className="text-sm text-emerald-800 flex items-start">
                  <span className="mr-2 text-emerald-500">•</span>
                  <span className="leading-relaxed">{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {mismatches.length > 0 && (
        <div className="glass-effect rounded-3xl p-8 card-hover">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <span className="text-neutral-900">Communication Mismatch</span>
          </h3>
          {mismatches.map((mismatch, idx) => (
            <div key={idx} className="space-y-5">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-red-500 p-6 rounded-2xl">
                <div className="font-bold text-red-900 mb-3 text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {mismatch.conflict_point}
                </div>
                <div className="text-sm text-red-800 leading-relaxed">
                  {mismatch.why_it_matters}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/50 hover:shadow-lg smooth-transition">
                  <div className="text-sm font-bold text-neutral-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Person A thinks they are:
                  </div>
                  <div className="text-sm text-neutral-900 leading-relaxed">
                    {mismatch.person1_interpretation}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/50 hover:shadow-lg smooth-transition">
                  <div className="text-sm font-bold text-neutral-700 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Person B interprets it as:
                  </div>
                  <div className="text-sm text-neutral-900 leading-relaxed">
                    {mismatch.person2_interpretation}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-6 rounded-2xl">
                <div className="text-sm font-bold text-yellow-900 mb-2">Translation:</div>
                <div className="text-sm text-yellow-800 leading-relaxed">
                  This is not a real disagreement. It is a style mismatch. Neither person is wrong, they just speak different emotional languages.
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
