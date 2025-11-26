import { Heart, Users, Lightbulb } from 'lucide-react';
import { AttachmentProfile } from '../lib/aiEngine';

interface AttachmentAnalysisProps {
  profile: AttachmentProfile;
}

export default function AttachmentAnalysis({ profile }: AttachmentAnalysisProps) {
  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Secure':
        return { bg: 'from-green-50 to-emerald-50', text: 'text-green-900', border: 'border-green-500' };
      case 'Anxious':
        return { bg: 'from-yellow-50 to-amber-50', text: 'text-yellow-900', border: 'border-yellow-500' };
      case 'Avoidant':
        return { bg: 'from-blue-50 to-cyan-50', text: 'text-blue-900', border: 'border-blue-500' };
      default:
        return { bg: 'from-neutral-50 to-white', text: 'text-neutral-900', border: 'border-neutral-500' };
    }
  };

  const personAColors = getStyleColor(profile.personA);
  const personBColors = getStyleColor(profile.personB);

  return (
    <div className="glass-effect rounded-3xl p-8 card-hover">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <span className="text-neutral-900">Attachment Style Detection</span>
      </h3>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div className={`bg-gradient-to-br ${personAColors.bg} rounded-2xl p-6 border-l-4 ${personAColors.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-neutral-600" />
            <div className="text-sm font-bold text-neutral-700">Person A</div>
          </div>
          <div className={`text-2xl font-bold ${personAColors.text} mb-2`}>
            {profile.personA}
          </div>
          <div className="text-xs text-neutral-600">
            {profile.personA === 'Secure' && 'Comfortable with intimacy and independence'}
            {profile.personA === 'Anxious' && 'Seeks reassurance and fears abandonment'}
            {profile.personA === 'Avoidant' && 'Values independence and needs space'}
          </div>
        </div>

        <div className={`bg-gradient-to-br ${personBColors.bg} rounded-2xl p-6 border-l-4 ${personBColors.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-neutral-600" />
            <div className="text-sm font-bold text-neutral-700">Person B</div>
          </div>
          <div className={`text-2xl font-bold ${personBColors.text} mb-2`}>
            {profile.personB}
          </div>
          <div className="text-xs text-neutral-600">
            {profile.personB === 'Secure' && 'Comfortable with intimacy and independence'}
            {profile.personB === 'Anxious' && 'Seeks reassurance and fears abandonment'}
            {profile.personB === 'Avoidant' && 'Values independence and needs space'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <div className="text-sm font-bold text-neutral-900">Recommendations</div>
        </div>

        {profile.recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-l-4 border-amber-500 hover:shadow-lg smooth-transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                {rec}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/50">
          <div className="text-xs font-bold text-neutral-900 mb-2 uppercase tracking-wide">
            About Attachment Styles
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">
            Attachment styles shape how we seek closeness and handle conflict. Understanding both styles helps explain relationship patterns and guides repair strategies.
          </p>
        </div>
      </div>
    </div>
  );
}
