import { Users, Briefcase, Heart, Home } from 'lucide-react';

interface RelationshipSelectorProps {
  selected: 'friendship' | 'co-founder' | 'romantic' | 'family' | null;
  onSelect: (type: 'friendship' | 'co-founder' | 'romantic' | 'family') => void;
}

export default function RelationshipSelector({ selected, onSelect }: RelationshipSelectorProps) {
  const types = [
    { id: 'friendship', label: 'Friendship', icon: Users, color: 'blue' },
    { id: 'co-founder', label: 'Co-founder', icon: Briefcase, color: 'green' },
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'red' },
    { id: 'family', label: 'Family', icon: Home, color: 'orange' }
  ] as const;

  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      hover: 'hover:border-blue-400'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
      hover: 'hover:border-green-400'
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      hover: 'hover:border-red-400'
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      hover: 'hover:border-orange-400'
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {types.map((type) => {
        const Icon = type.icon;
        const colors = colorClasses[type.color];
        const isSelected = selected === type.id;

        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`
              p-6 rounded-xl border-2 transition-all
              ${isSelected ? `${colors.border} ${colors.bg}` : 'border-gray-200 bg-white hover:border-gray-300'}
              ${!isSelected && colors.hover}
            `}
          >
            <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? colors.text : 'text-gray-400'}`} />
            <div className={`font-medium ${isSelected ? colors.text : 'text-gray-700'}`}>
              {type.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
