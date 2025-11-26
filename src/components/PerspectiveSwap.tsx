import { useState } from 'react';
import { RefreshCw, MessageCircle, Eye } from 'lucide-react';
import { PerspectiveResult } from '../lib/aiEngine';

interface PerspectiveSwapProps {
  perspectives: { youToThem: PerspectiveResult; themToYou: PerspectiveResult };
}

export default function PerspectiveSwap({ perspectives }: PerspectiveSwapProps) {
  const [activeTab, setActiveTab] = useState<'youToThem' | 'themToYou'>('youToThem');

  const currentPerspective = perspectives[activeTab];

  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Perspective Swap Mode</span>
      </h3>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('youToThem')}
          className={`flex-1 px-6 py-4 rounded-2xl font-semibold smooth-transition ${
            activeTab === 'youToThem'
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>You → Them</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('themToYou')}
          className={`flex-1 px-6 py-4 rounded-2xl font-semibold smooth-transition ${
            activeTab === 'themToYou'
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Them → You</span>
          </div>
        </button>
      </div>

      <div className="space-y-5 animate-fadeIn">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <div className="text-sm font-bold text-blue-900">What They Intended:</div>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            {currentPerspective.sender_intent}
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border-l-4 border-rose-500">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-rose-600" />
            <div className="text-sm font-bold text-rose-900">How It Was Received:</div>
          </div>
          <p className="text-sm text-rose-800 leading-relaxed">
            {currentPerspective.receiver_interpretation}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 border-l-4 border-yellow-500">
          <div className="text-xs font-bold text-yellow-900 mb-2 uppercase tracking-wide">
            The Gap
          </div>
          <p className="text-sm text-yellow-800 leading-relaxed">
            This is where the breakdown happened. Intention and interpretation didn't match, creating hurt neither person meant to cause.
          </p>
        </div>
      </div>
    </div>
  );
}
