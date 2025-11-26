import { Tag, Lightbulb } from 'lucide-react';
import { ConflictType } from '../lib/aiEngine';

interface ConflictArchetypeProps {
  archetype: ConflictType;
}

export default function ConflictArchetype({ archetype }: ConflictArchetypeProps) {
  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
          <Tag className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Conflict Archetype</span>
      </h3>

      <div className="space-y-5">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border-l-4 border-violet-500">
          <div className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2">
            Classified As
          </div>
          <div className="text-2xl font-bold text-violet-900 mb-3">
            {archetype.type}
          </div>
          <p className="text-sm text-violet-800 leading-relaxed">
            {archetype.description}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-green-600" />
            <div className="text-sm font-bold text-green-900">Repair Strategy</div>
          </div>
          <p className="text-sm text-green-800 leading-relaxed">
            {archetype.repair_strategy}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200/50">
          <div className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">
            Why This Matters
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            Recognizing the archetype helps you skip the guessing game and go straight to the repair strategy that actually works for this type of conflict.
          </p>
        </div>
      </div>
    </div>
  );
}
