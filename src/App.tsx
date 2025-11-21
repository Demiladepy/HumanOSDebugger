import { useState } from 'react';
import { Activity } from 'lucide-react';
import RelationshipSelector from './components/RelationshipSelector';
import ConflictInput from './components/ConflictInput';
import EmotionalDebugMap from './components/EmotionalDebugMap';
import CommunicationAnalysis from './components/CommunicationAnalysis';
import CrisisSimulator from './components/CrisisSimulator';
import RepairPlaybook from './components/RepairPlaybook';
import { analyzeConflict } from './lib/analysisEngine';

function App() {
  const [relationshipType, setRelationshipType] = useState<'friendship' | 'co-founder' | 'romantic' | 'family' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conflictText, setConflictText] = useState('');
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeConflict> | null>(null);

  const handleAnalyze = async (text: string) => {
    if (!relationshipType) return;

    setIsAnalyzing(true);
    setConflictText(text);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = analyzeConflict(text, relationshipType);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setRelationshipType(null);
    setAnalysis(null);
    setConflictText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-gray-900" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              HumanOS Debugger
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The first AI engine that debugs human relationships like code — analyzing conflicts, translating emotional languages, and simulating outcomes before things break.
          </p>
        </div>

        {!analysis ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Select Relationship Type
              </h2>
              <RelationshipSelector
                selected={relationshipType}
                onSelect={setRelationshipType}
              />
            </div>

            {relationshipType && (
              <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Describe the Conflict
                </h2>
                <ConflictInput
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
              >
                New Analysis
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <EmotionalDebugMap
                  emotionalTone={analysis.emotionalTone}
                  unmetNeeds={analysis.unmetNeeds}
                  escalationChain={analysis.escalationChain}
                  misunderstandingRoot={analysis.misunderstandingRoot}
                />
              </div>

              <div className="space-y-8">
                <CommunicationAnalysis
                  dialects={analysis.communicationDialects}
                  mismatches={analysis.dialectMismatch}
                />

                <CrisisSimulator conflictText={conflictText} />
              </div>
            </div>

            <RepairPlaybook steps={analysis.repairPlaybook} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
