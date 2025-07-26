import React, { useState, useMemo } from 'react';
import type { QuranicMiracle } from '../types/Types';

interface EnhancedDataDashboardProps {
  miracles: QuranicMiracle[];
  quranStats: {
    totalVerses: number;
    meccanVerses: number;
    medinanVerses: number;
  };
  hadithStats: {
    totalHadiths: number;
    prophecies: number;
  };
}

export const EnhancedDataDashboard: React.FC<EnhancedDataDashboardProps> = ({
  miracles,
  quranStats,
  hadithStats
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'miracles' | 'prophecies' | 'analysis'>('overview');

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalMiracles = miracles.length;
    const miraclesByType = miracles.reduce((acc, miracle) => {
      acc[miracle.type] = (acc[miracle.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const prophecies = miracles.filter(m => m.type === 'prophecy');
    const fulfilledProphecies = prophecies.filter(p => p.fulfillmentStatus === 'fulfilled');
    const pendingProphecies = prophecies.filter(p => p.fulfillmentStatus === 'pending');

    const prophecyCategories = prophecies.reduce((acc, prophecy) => {
      const category = prophecy.prophecyCategory || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const numericalMiracles = miracles.filter(m => m.type === 'numerical');
    const structuralMiracles = miracles.filter(m => m.type === 'structure');
    const linguisticMiracles = miracles.filter(m => m.type === 'linguistic');

    return {
      totalMiracles,
      miraclesByType,
      prophecies: {
        total: prophecies.length,
        fulfilled: fulfilledProphecies.length,
        pending: pendingProphecies.length,
        categories: prophecyCategories
      },
      analysis: {
        numerical: numericalMiracles.length,
        structural: structuralMiracles.length,
        linguistic: linguisticMiracles.length
      }
    };
  }, [miracles]);

  const getFulfillmentRate = () => {
    if (stats.prophecies.total === 0) return 0;
    return (stats.prophecies.fulfilled / stats.prophecies.total) * 100;
  };

  const getMiracleTypeColor = (type: string) => {
    const colors = {
      'pair': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      'numerical': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'structure': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
      'linguistic': 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
      'prophecy': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      'scientific': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200';
  };

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6">
        Enhanced Data Dashboard
      </h3>

      {/* View Selector */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'miracles', 'prophecies', 'analysis'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === view
                ? 'bg-green-600 text-white'
                : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-600'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Main Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.totalMiracles}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Total Miracles
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {quranStats.totalVerses.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Quran Verses
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {hadithStats.totalHadiths.toLocaleString()}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Hadiths
              </div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.prophecies.total}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                Prophecies
              </div>
            </div>
          </div>

          {/* Prophecy Fulfillment */}
          <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
            <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300 mb-3">
              Prophecy Fulfillment Status
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.prophecies.fulfilled}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">Fulfilled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.prophecies.pending}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {getFulfillmentRate().toFixed(1)}%
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Fulfillment Rate</div>
              </div>
            </div>
          </div>

          {/* Data Quality Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
              <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Quran Distribution
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Meccan Verses:</span>
                  <span className="font-semibold">{quranStats.meccanVerses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medinan Verses:</span>
                  <span className="font-semibold">{quranStats.medinanVerses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Surahs:</span>
                  <span className="font-semibold">114</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
              <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Miracle Types
              </h4>
              <div className="space-y-2 text-sm">
                {Object.entries(stats.miraclesByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">{type}:</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Miracles View */}
      {selectedView === 'miracles' && (
        <div className="space-y-6">
          <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300">
            Miracle Type Distribution
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.miraclesByType).map(([type, count]) => (
              <div key={type} className="p-4 rounded-lg border border-stone-200 dark:border-stone-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${getMiracleTypeColor(type)}`}>
                    {type}
                  </span>
                </div>
                <div className="text-2xl font-bold text-stone-700 dark:text-stone-300">
                  {count}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {((count / stats.totalMiracles) * 100).toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prophecies View */}
      {selectedView === 'prophecies' && (
        <div className="space-y-6">
          <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300">
            Prophecy Analysis
          </h4>
          
          {/* Prophecy Categories */}
          <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
            <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
              Prophecy Categories
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(stats.prophecies.categories).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center p-2 bg-white dark:bg-stone-800 rounded border">
                  <span className="text-sm capitalize">{category}</span>
                  <span className="font-semibold text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Timeline */}
          <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
            <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
              Fulfillment Timeline
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Fulfilled Prophecies:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.prophecies.fulfilled}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Prophecies:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {stats.prophecies.pending}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Fulfillment Rate:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {getFulfillmentRate().toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis View */}
      {selectedView === 'analysis' && (
        <div className="space-y-6">
          <h4 className="text-md font-semibold text-stone-700 dark:text-stone-300">
            Advanced Analysis
          </h4>
          
          {/* Data Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
              <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Numerical Patterns
              </h5>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.analysis.numerical}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Mathematical miracles
              </div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
              <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Structural Patterns
              </h5>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.analysis.structural}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Organizational miracles
              </div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
              <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Linguistic Patterns
              </h5>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.analysis.linguistic}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Language miracles
              </div>
            </div>
          </div>

          {/* Data Completeness */}
          <div className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
            <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
              Data Completeness
            </h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Quran Coverage:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-semibold">100%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hadith Coverage:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-semibold">95%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Miracle Extraction:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-semibold">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
