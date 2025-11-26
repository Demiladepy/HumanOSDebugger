import { useState } from 'react';
import { FileText, Send, Sparkles, Keyboard, Mic } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

interface ConflictInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export default function ConflictInput({ onAnalyze, isAnalyzing }: ConflictInputProps) {
  const [text, setText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');

  const handleVoiceTranscript = (transcript: string) => {
    setText(prev => (prev ? prev + ' ' + transcript : transcript));
  };

  const handleSubmit = () => {
    if (text.trim().length > 20) {
      onAnalyze(text);
    }
  };

  const examples = [
    "They said they'd be there but canceled last minute without explanation...",
    'My co-founder keeps making decisions without consulting me...',
    'Every time I try to talk about our relationship, they shut down...',
    'My sibling always brings up old arguments when we disagree...'
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setInputMode('text')}
          disabled={isAnalyzing}
          className={`flex-1 px-6 py-3 rounded-2xl font-semibold smooth-transition flex items-center justify-center gap-2 ${
            inputMode === 'text'
              ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Keyboard className="w-5 h-5" />
          <span>Type</span>
        </button>

        <button
          onClick={() => setInputMode('voice')}
          disabled={isAnalyzing}
          className={`flex-1 px-6 py-3 rounded-2xl font-semibold smooth-transition flex items-center justify-center gap-2 ${
            inputMode === 'voice'
              ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Mic className="w-5 h-5" />
          <span>Speak</span>
        </button>
      </div>

      {inputMode === 'voice' && (
        <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={isAnalyzing} />
      )}

      <div className="relative">
        <div className="absolute -top-2 left-4 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white text-xs font-medium px-3 py-1 rounded-full z-10">
          Conflict Description
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what happened in detail. Include exact words, tone, and how you felt..."
          className="w-full h-56 p-6 bg-white/50 backdrop-blur-sm border-2 border-neutral-200/50 rounded-3xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none smooth-transition text-base leading-relaxed placeholder:text-neutral-400"
        />
        <div className="absolute bottom-4 right-5 flex items-center gap-3">
          <div className={`text-sm font-medium ${
            text.length >= 20 ? 'text-blue-600' : 'text-neutral-400'
          }`}>
            {text.length} / 20+
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-sm text-neutral-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Share as much detail as possible for better insights
        </div>
        <button
          onClick={handleSubmit}
          disabled={text.trim().length < 20 || isAnalyzing}
          className={`
            px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 smooth-transition
            ${text.trim().length >= 20 && !isAnalyzing
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Conflict</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Start Analysis</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Quick Start Examples
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setText(example)}
              className="text-left p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 hover:from-white hover:to-neutral-50 border border-neutral-200/50 rounded-2xl text-sm text-neutral-700 smooth-transition hover:shadow-lg hover:scale-[1.02] active:scale-95"
            >
              <div className="font-medium mb-1 text-neutral-900">Example {idx + 1}</div>
              <div className="text-neutral-600 text-xs line-clamp-2">{example}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
