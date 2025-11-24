import { Users, Briefcase, Heart, Home } from 'lucide-react';

interface RelationshipSelectorProps {
  selected: 'friendship' | 'co-founder' | 'romantic' | 'family' | null;
  onSelect: (type: 'friendship' | 'co-founder' | 'romantic' | 'family') => void;
}

export default function RelationshipSelector({ selected, onSelect }: RelationshipSelectorProps) {
  const types = [
    {
      id: 'friendship',
      label: 'Friendship',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      id: 'co-founder',
      label: 'Co-founder',
      icon: Briefcase,
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/20'
    },
    {
      id: 'romantic',
      label: 'Romantic',
      icon: Heart,
      gradient: 'from-rose-500 to-pink-500',
      shadowColor: 'shadow-rose-500/20'
    },
    {
      id: 'family',
      label: 'Family',
      icon: Home,
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/20'
    }
  ] as const;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {types.map((type) => {
        const Icon = type.icon;
        const isSelected = selected === type.id;

        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`
              group relative overflow-hidden
              p-8 rounded-3xl smooth-transition
              ${isSelected
                ? `bg-gradient-to-br ${type.gradient} shadow-2xl ${type.shadowColor} scale-105`
                : 'bg-white/50 backdrop-blur-sm border border-neutral-200/50 hover:border-neutral-300 hover:shadow-xl hover:scale-105'
              }
            `}
          >
            <div className="relative z-10">
              <div className={`
                w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center
                smooth-transition
                ${isSelected
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-neutral-100 group-hover:bg-neutral-200'
                }
              `}>
                <Icon className={`
                  w-7 h-7 smooth-transition
                  ${isSelected ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-900'}
                `} />
              </div>
              <div className={`
                font-semibold text-base smooth-transition
                ${isSelected ? 'text-white' : 'text-neutral-700 group-hover:text-neutral-900'}
              `}>
                {type.label}
              </div>
            </div>

            {isSelected && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl animate-scaleIn" />
            )}
          </button>
        );
      })}
    </div>
  );
}
