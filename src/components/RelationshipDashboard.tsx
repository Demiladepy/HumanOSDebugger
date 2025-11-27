import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Heart, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Relationship, Conflict, getConflictHistory, calculateHealthTrend, getConflictPatterns, ConflictPattern } from '../lib/database';

interface RelationshipDashboardProps {
  relationship: Relationship;
}

export default function RelationshipDashboard({ relationship }: RelationshipDashboardProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [patterns, setPatterns] = useState<ConflictPattern[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [relationship.id]);

  const loadData = async () => {
    setLoading(true);
    const [conflictsData, patternsData, trendsData] = await Promise.all([
      getConflictHistory(relationship.id),
      getConflictPatterns(relationship.id),
      calculateHealthTrend(relationship.id)
    ]);

    setConflicts(conflictsData);
    setPatterns(patternsData);
    setTrends(trendsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-3xl p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-neutral-600 mt-4">Loading relationship insights...</p>
      </div>
    );
  }

  const activeConflicts = conflicts.filter(c => c.status === 'active').length;
  const resolvedConflicts = conflicts.filter(c => c.status === 'resolved').length;
  const recurringConflicts = conflicts.filter(c => c.status === 'recurring').length;

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">{relationship.partner_name}</h2>
            <p className="text-neutral-600 capitalize">{relationship.relationship_type}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600">Member since</div>
            <div className="text-neutral-900 font-semibold">
              {new Date(relationship.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-blue-600" />
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wide">Trust Score</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{relationship.trust_score}%</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div className="text-xs font-bold text-green-700 uppercase tracking-wide">Health Score</div>
            </div>
            <div className="text-3xl font-bold text-green-900">{relationship.health_score}%</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 border-2 border-yellow-200/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Active Issues</div>
            </div>
            <div className="text-3xl font-bold text-yellow-900">{activeConflicts}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">Resolved</div>
            </div>
            <div className="text-3xl font-bold text-purple-900">{resolvedConflicts}</div>
          </div>
        </div>
      </div>

      {patterns.length > 0 && (
        <div className="glass-effect rounded-3xl p-8 card-hover">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span>Recurring Conflict Patterns</span>
          </h3>

          <div className="space-y-4">
            {patterns.slice(0, 3).map((pattern) => (
              <div key={pattern.id} className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-red-900 text-lg mb-1">{pattern.pattern_type}</div>
                    <div className="text-sm text-red-700">
                      Occurred <span className="font-bold">{pattern.frequency} times</span>
                    </div>
                  </div>
                  <div className="text-xs text-red-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(pattern.last_occurred).toLocaleDateString()}
                  </div>
                </div>

                {pattern.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pattern.triggers.map((trigger, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-200/50 text-red-900 text-xs font-semibold rounded-full">
                        {trigger}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 border-l-4 border-yellow-500">
            <div className="text-sm font-bold text-yellow-900 mb-2">Pattern Detection Active</div>
            <p className="text-sm text-yellow-800 leading-relaxed">
              ChatGPT cannot do this! We track your conflicts over time to identify recurring patterns. Each new conflict helps us better understand your relationship dynamics.
            </p>
          </div>
        </div>
      )}

      <div className="glass-effect rounded-3xl p-8 card-hover">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Recent Conflicts</h3>

        {conflicts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-neutral-600 font-medium">No conflicts recorded yet</p>
            <p className="text-sm text-neutral-500 mt-2">Start analyzing conflicts to build your relationship history</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conflicts.slice(0, 5).map((conflict) => (
              <div key={conflict.id} className={`rounded-2xl p-5 border-l-4 smooth-transition hover:shadow-lg ${
                conflict.status === 'resolved'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500'
                  : conflict.status === 'recurring'
                  ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-500'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                        conflict.status === 'resolved'
                          ? 'bg-green-200 text-green-900'
                          : conflict.status === 'recurring'
                          ? 'bg-orange-200 text-orange-900'
                          : 'bg-red-200 text-red-900'
                      }`}>
                        {conflict.status}
                      </span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                        conflict.severity === 'critical'
                          ? 'bg-red-600 text-white'
                          : conflict.severity === 'high'
                          ? 'bg-orange-500 text-white'
                          : 'bg-yellow-400 text-yellow-900'
                      }`}>
                        {conflict.severity}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 line-clamp-2">
                      {conflict.conflict_text}
                    </p>
                  </div>
                  <div className="text-xs text-neutral-500 ml-4 whitespace-nowrap">
                    {new Date(conflict.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
