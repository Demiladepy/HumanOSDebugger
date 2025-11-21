import { MessageSquare, GitCompare } from 'lucide-react';
import { CommunicationDialect, DialectMismatch } from '../lib/analysisEngine';

interface CommunicationAnalysisProps {
  dialects: CommunicationDialect;
  mismatches: DialectMismatch[];
}

export default function CommunicationAnalysis({ dialects, mismatches }: CommunicationAnalysisProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Communication Dialects
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="font-semibold text-blue-900 mb-2">Person A</div>
            <div className="text-sm font-medium text-blue-700 mb-3 capitalize">
              {dialects.person1.style} Communicator
            </div>
            <ul className="space-y-1">
              {dialects.person1.traits.map((trait, idx) => (
                <li key={idx} className="text-sm text-blue-600 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="font-semibold text-green-900 mb-2">Person B</div>
            <div className="text-sm font-medium text-green-700 mb-3 capitalize">
              {dialects.person2.style} Communicator
            </div>
            <ul className="space-y-1">
              {dialects.person2.traits.map((trait, idx) => (
                <li key={idx} className="text-sm text-green-600 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {mismatches.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-red-500" />
            Communication Mismatch Detected
          </h3>
          {mismatches.map((mismatch, idx) => (
            <div key={idx} className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="font-semibold text-red-900 mb-2">
                  {mismatch.conflict_point}
                </div>
                <div className="text-sm text-red-800">
                  {mismatch.why_it_matters}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Person A thinks they're:
                  </div>
                  <div className="text-sm text-gray-900">
                    {mismatch.person1_interpretation}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Person B interprets it as:
                  </div>
                  <div className="text-sm text-gray-900">
                    {mismatch.person2_interpretation}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <div className="text-sm font-medium text-yellow-900">Translation:</div>
                <div className="text-sm text-yellow-800 mt-1">
                  This isn't a real disagreement. It's a style mismatch. Neither person is wrong, they just speak different emotional languages.
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
