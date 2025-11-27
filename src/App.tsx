import { useState, useEffect } from 'react';
import { Activity, Layers, Database, Users as UsersIcon } from 'lucide-react';
import RelationshipSelector from './components/RelationshipSelector';
import ConflictInput from './components/ConflictInput';
import EmotionalDebugMap from './components/EmotionalDebugMap';
import CommunicationAnalysis from './components/CommunicationAnalysis';
import RepairPlaybook from './components/RepairPlaybook';
import EmotionalHeatmap from './components/EmotionalHeatmap';
import EmotionalDiff from './components/EmotionalDiff';
import PerspectiveSwap from './components/PerspectiveSwap';
import CompatibilityMatrix from './components/CompatibilityMatrix';
import CrisisSimulatorV2 from './components/CrisisSimulatorV2';
import DynamicRepairPlaybook from './components/DynamicRepairPlaybook';
import ConflictArchetype from './components/ConflictArchetype';
import MicroEmotionMap from './components/MicroEmotionMap';
import AttachmentAnalysis from './components/AttachmentAnalysis';
import RootCauseTree from './components/RootCauseTree';
import RelationshipDashboard from './components/RelationshipDashboard';
import SharedConflictPortal from './components/SharedConflictPortal';
import { analyzeConflict } from './lib/analysisEngine';
import { getRelationships, createRelationship, saveConflict, detectAndSavePattern, Relationship } from './lib/database';
import {
  getEmotionalTimeline,
  getEmotionalDiff,
  getPerspectiveSwap,
  getCompatibilityMatrix,
  classifyConflict,
  extractMicroEmotions,
  detectAttachmentStyles,
  generateRootCauseTree
} from './lib/aiEngine';

function App() {
  const [view, setView] = useState<'home' | 'dashboard' | 'shared' | 'analysis'>('home');
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [relationshipType, setRelationshipType] = useState<'friendship' | 'co-founder' | 'romantic' | 'family' | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conflictText, setConflictText] = useState('');
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeConflict> | null>(null);
  const [advancedData, setAdvancedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'core' | 'advanced' | 'history'>('core');

  useEffect(() => {
    loadRelationships();
  }, []);

  const loadRelationships = async () => {
    const data = await getRelationships();
    setRelationships(data);
  };

  const handleCreateRelationship = async () => {
    if (!relationshipType || !partnerName) return;

    const relationship = await createRelationship(relationshipType, partnerName);
    if (relationship) {
      setSelectedRelationship(relationship);
      await loadRelationships();
      setView('dashboard');
    }
  };

  const handleAnalyze = async (text: string) => {
    if (!relationshipType) return;

    setIsAnalyzing(true);
    setConflictText(text);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const coreResult = analyzeConflict(text, relationshipType);
    setAnalysis(coreResult);

    if (selectedRelationship) {
      await saveConflict(selectedRelationship.id, text, coreResult, 'medium');
      await detectAndSavePattern(selectedRelationship.id, coreResult.misunderstandingRoot, ['communication mismatch']);
    }

    const [timeline, diff, youToThem, themToYou, compatibility, archetype, microEmotions, attachment, rootCause] = await Promise.all([
      getEmotionalTimeline(text),
      getEmotionalDiff(text),
      getPerspectiveSwap(text, 'youToThem'),
      getPerspectiveSwap(text, 'themToYou'),
      getCompatibilityMatrix(text),
      classifyConflict(text),
      extractMicroEmotions(text),
      detectAttachmentStyles(text),
      generateRootCauseTree(text)
    ]);

    setAdvancedData({
      timeline,
      diff,
      perspectives: { youToThem, themToYou },
      compatibility,
      archetype,
      microEmotions,
      attachment,
      rootCause
    });

    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setRelationshipType(null);
    setAnalysis(null);
    setAdvancedData(null);
    setConflictText('');
    setActiveTab('core');
    setPartnerName('');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/20 to-cyan-50/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center gap-3 mb-6 p-3 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">HumanOS</span>
            <span className="text-neutral-900"> Debugger</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-medium">
            The first AI engine that debugs human relationships like code — analyzing conflicts, translating emotional languages, and simulating outcomes before things break.
          </p>

          {view === 'home' && (
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setView('analysis')}
                className="glass-effect rounded-2xl p-6 hover:shadow-xl smooth-transition hover:scale-105 active:scale-95 text-left"
              >
                <Activity className="w-8 h-8 text-blue-600 mb-3" />
                <div className="font-bold text-neutral-900 mb-2">Quick Analysis</div>
                <div className="text-sm text-neutral-600">Analyze a conflict right now</div>
              </button>

              <button
                onClick={() => setView('dashboard')}
                className="glass-effect rounded-2xl p-6 hover:shadow-xl smooth-transition hover:scale-105 active:scale-95 text-left"
              >
                <Database className="w-8 h-8 text-green-600 mb-3" />
                <div className="font-bold text-neutral-900 mb-2">Track History</div>
                <div className="text-sm text-neutral-600">See patterns over time</div>
              </button>

              <button
                onClick={() => setView('shared')}
                className="glass-effect rounded-2xl p-6 hover:shadow-xl smooth-transition hover:scale-105 active:scale-95 text-left"
              >
                <UsersIcon className="w-8 h-8 text-purple-600 mb-3" />
                <div className="font-bold text-neutral-900 mb-2">Both Sides</div>
                <div className="text-sm text-neutral-600">2-person perspective analysis</div>
              </button>
            </div>
          )}
        </div>

        {(view === 'dashboard' || view === 'shared') && !selectedRelationship && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-effect rounded-3xl p-10 space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Create a Relationship Profile</h2>
              <p className="text-neutral-600">To track patterns and history, first create a relationship profile.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-neutral-700 mb-3 block">Relationship Type</label>
                  <RelationshipSelector selected={relationshipType} onSelect={setRelationshipType} />
                </div>

                {relationshipType && (
                  <div>
                    <label className="text-sm font-bold text-neutral-700 mb-3 block">Partner Name</label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Enter their name or nickname"
                      className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-neutral-200/50 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                )}

                <button
                  onClick={handleCreateRelationship}
                  disabled={!relationshipType || !partnerName}
                  className={`w-full py-4 rounded-2xl font-semibold smooth-transition ${
                    relationshipType && partnerName
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && selectedRelationship && (
          <RelationshipDashboard relationship={selectedRelationship} />
        )}

        {view === 'shared' && selectedRelationship && (
          <SharedConflictPortal
            relationshipId={selectedRelationship.id}
            onComplete={() => setView('analysis')}
          />
        )}

        {view === 'analysis' && !analysis && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="glass-effect rounded-[2.5rem] p-10 md:p-12 animate-slideUp">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
                Select Relationship Type
              </h2>
              <RelationshipSelector
                selected={relationshipType}
                onSelect={setRelationshipType}
              />
            </div>

            {relationshipType && (
              <div className="glass-effect rounded-[2.5rem] p-10 md:p-12 animate-slideUp">
                <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
                  Describe the Conflict
                </h2>
                <ConflictInput
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}
          </div>
        )}

        {view === 'analysis' && analysis && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-effect rounded-[2.5rem] p-8">
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-2">Analysis Complete</h2>
                <p className="text-neutral-600">Comprehensive conflict breakdown with actionable insights</p>
              </div>
              <button
                onClick={handleReset}
                className="btn-secondary whitespace-nowrap"
              >
                New Analysis
              </button>
            </div>

            <div className="glass-effect rounded-[2.5rem] p-4 flex gap-3">
              <button
                onClick={() => setActiveTab('core')}
                className={`flex-1 px-6 py-4 rounded-2xl font-semibold smooth-transition flex items-center justify-center gap-2 ${
                  activeTab === 'core'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Activity className="w-5 h-5" />
                Core Analysis
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex-1 px-6 py-4 rounded-2xl font-semibold smooth-transition flex items-center justify-center gap-2 ${
                  activeTab === 'advanced'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Layers className="w-5 h-5" />
                Advanced Features
              </button>
            </div>

            {activeTab === 'core' ? (
              <>
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
                  </div>
                </div>

                <RepairPlaybook steps={analysis.repairPlaybook} />
              </>
            ) : (
              advancedData && (
                <>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <EmotionalHeatmap timeline={advancedData.timeline} />
                    <EmotionalDiff diff={advancedData.diff} />
                  </div>

                  <PerspectiveSwap perspectives={advancedData.perspectives} />

                  <CompatibilityMatrix items={advancedData.compatibility} />

                  <div className="grid lg:grid-cols-2 gap-8">
                    <ConflictArchetype archetype={advancedData.archetype} />
                    <MicroEmotionMap emotions={advancedData.microEmotions} />
                  </div>

                  <AttachmentAnalysis profile={advancedData.attachment} />

                  <RootCauseTree tree={advancedData.rootCause} />

                  <CrisisSimulatorV2 conflictText={conflictText} />

                  <DynamicRepairPlaybook conflictText={conflictText} />
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
