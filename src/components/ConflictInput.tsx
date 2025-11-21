import { useState } from 'react';
import { FileText, Send } from 'lucide-react';

interface ConflictInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export default function ConflictInput({ onAnalyze, isAnalyzing }: ConflictInputProps) {
  const [text, setText] = useState('');

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
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the conflict, paste a conversation, or explain what happened..."
          className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none resize-none"
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
          {text.length} characters
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Minimum 20 characters needed
        </div>
        <button
          onClick={handleSubmit}
          disabled={text.trim().length < 20 || isAnalyzing}
          className={`
            px-6 py-3 rounded-lg font-medium flex items-center gap-2
            ${text.trim().length >= 20 && !isAnalyzing
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze Conflict
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Examples:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setText(example)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
            >
              <FileText className="w-3 h-3 inline mr-2" />
              {example.substring(0, 60)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
