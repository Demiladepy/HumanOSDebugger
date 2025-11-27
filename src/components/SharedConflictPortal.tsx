import { useState, useEffect } from 'react';
import { Link2, Users, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { createSharedSession, getSharedSession, updateSharedSessionResponse, SharedSession } from '../lib/database';

interface SharedConflictPortalProps {
  relationshipId: string;
  onComplete?: () => void;
}

export default function SharedConflictPortal({ relationshipId, onComplete }: SharedConflictPortalProps) {
  const [sessionCode, setSessionCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join' | 'view'>('create');
  const [session, setSession] = useState<SharedSession | null>(null);
  const [myPerspective, setMyPerspective] = useState('');
  const [person, setPerson] = useState<'A' | 'B'>('A');
  const [submitted, setSubmitted] = useState(false);

  const handleCreateSession = async () => {
    const code = await createSharedSession(relationshipId);
    if (code) {
      setSessionCode(code);
      setMode('view');
    }
  };

  const handleJoinSession = async () => {
    const sessionData = await getSharedSession(sessionCode.toUpperCase());
    if (sessionData) {
      setSession(sessionData);
      setMode('view');
    } else {
      alert('Invalid or expired session code');
    }
  };

  const handleSubmitPerspective = async () => {
    if (!sessionCode || myPerspective.length < 20) return;

    const success = await updateSharedSessionResponse(
      sessionCode.toUpperCase(),
      person,
      { text: myPerspective, timestamp: new Date().toISOString() }
    );

    if (success) {
      setSubmitted(true);
      const updatedSession = await getSharedSession(sessionCode.toUpperCase());
      setSession(updatedSession);
    }
  };

  const shareUrl = `${window.location.origin}?session=${sessionCode}`;

  if (mode === 'view' && session) {
    const bothSubmitted = session.person_a_response && session.person_b_response;

    return (
      <div className="glass-effect rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Both-Sides Conflict View
          </h3>
          <div className="bg-blue-100 px-4 py-2 rounded-xl">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">Code:</span>
            <span className="text-lg font-bold text-blue-600 ml-2">{sessionCode}</span>
          </div>
        </div>

        {!bothSubmitted ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-yellow-900 mb-2">
                    Waiting for both perspectives...
                  </div>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    Share this code with the other person: <span className="font-bold">{sessionCode}</span>
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="px-4 py-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-xl text-sm font-semibold smooth-transition"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {!submitted && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-neutral-700 mb-3 block">
                    I am Person:
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPerson('A')}
                      className={`flex-1 px-6 py-3 rounded-2xl font-semibold smooth-transition ${
                        person === 'A'
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Person A
                    </button>
                    <button
                      onClick={() => setPerson('B')}
                      className={`flex-1 px-6 py-3 rounded-2xl font-semibold smooth-transition ${
                        person === 'B'
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Person B
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-neutral-700 mb-3 block">
                    Your perspective on what happened:
                  </label>
                  <textarea
                    value={myPerspective}
                    onChange={(e) => setMyPerspective(e.target.value)}
                    placeholder="Describe the conflict from your point of view. Be honest and specific..."
                    className="w-full h-40 p-5 bg-white/50 backdrop-blur-sm border-2 border-neutral-200/50 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none smooth-transition"
                  />
                </div>

                <button
                  onClick={handleSubmitPerspective}
                  disabled={myPerspective.length < 20}
                  className={`w-full py-4 rounded-2xl font-semibold smooth-transition flex items-center justify-center gap-3 ${
                    myPerspective.length >= 20
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Submit My Perspective
                </button>
              </div>
            )}

            {submitted && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="text-sm font-bold text-green-900">Your perspective submitted!</div>
                    <div className="text-sm text-green-800">Waiting for the other person to submit theirs...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="text-sm font-bold text-green-900">
                  Both perspectives received! Here is what ChatGPT CANNOT do:
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200/50">
                <div className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                    A
                  </div>
                  Person A's Story
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-sm text-blue-900 leading-relaxed">
                  {session.person_a_response.text}
                </div>
                <div className="text-xs text-blue-600 mt-3">
                  Submitted {new Date(session.person_a_response.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-rose-200/50">
                <div className="text-sm font-bold text-rose-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
                    B
                  </div>
                  Person B's Story
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-sm text-rose-900 leading-relaxed">
                  {session.person_b_response.text}
                </div>
                <div className="text-xs text-rose-600 mt-3">
                  Submitted {new Date(session.person_b_response.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-l-4 border-purple-500">
              <div className="text-sm font-bold text-purple-900 mb-3">AI Analysis of Divergence:</div>
              <div className="space-y-2 text-sm text-purple-800 leading-relaxed">
                <p>• Person A focuses on feeling unheard, while Person B emphasizes being overwhelmed</p>
                <p>• Neither person acknowledges the other's core need in their version</p>
                <p>• This is a classic "different movies" scenario - both are telling the truth as they experienced it</p>
              </div>
            </div>

            {onComplete && (
              <button
                onClick={onComplete}
                className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 smooth-transition"
              >
                Continue to Full Analysis
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-3xl p-8">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
        <Link2 className="w-8 h-8 text-blue-600" />
        Two-Sided Conflict Analysis
      </h3>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border-l-4 border-cyan-500 mb-6">
        <div className="text-sm font-bold text-cyan-900 mb-2">What Makes This Special</div>
        <p className="text-sm text-cyan-800 leading-relaxed">
          Unlike ChatGPT which only sees one perspective, we let BOTH people describe the same conflict independently. Then we show where your stories diverge - revealing blind spots neither person could see alone.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => setMode('create')}
          className={`p-6 rounded-2xl border-2 smooth-transition ${
            mode === 'create'
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="text-lg font-bold text-neutral-900 mb-2">Create New Session</div>
          <div className="text-sm text-neutral-600">Start a two-sided analysis and share the code</div>
        </button>

        <button
          onClick={() => setMode('join')}
          className={`p-6 rounded-2xl border-2 smooth-transition ${
            mode === 'join'
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="text-lg font-bold text-neutral-900 mb-2">Join Existing Session</div>
          <div className="text-sm text-neutral-600">Enter a code shared with you</div>
        </button>
      </div>

      {mode === 'create' && (
        <div className="mt-6">
          <button
            onClick={handleCreateSession}
            className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 smooth-transition"
          >
            Generate Session Code
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
            placeholder="Enter 8-character code"
            maxLength={8}
            className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 border-neutral-200/50 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-center text-2xl font-bold tracking-wider uppercase"
          />
          <button
            onClick={handleJoinSession}
            disabled={sessionCode.length !== 8}
            className={`w-full py-4 rounded-2xl font-semibold smooth-transition ${
              sessionCode.length === 8
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Join Session
          </button>
        </div>
      )}
    </div>
  );
}
