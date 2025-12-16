import React, { useState } from 'react';
import { generateSEOStrategy } from './services/geminiService';
import { SEOStrategy } from './types';
import HierarchyTree from './components/HierarchyTree';
import StrategyTable from './components/StrategyTable';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SEOStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateSEOStrategy(topic);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating the strategy.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;

    // Define headers
    const headers = [
      "Type",
      "Topic/Keyword",
      "Intent",
      "Difficulty",
      "Semantic Keywords",
      "Cluster Keywords",
      "Content Angle",
      "Internal Linking Strategy"
    ];

    // Create rows
    // Row 1: Pillar
    const pillarRow = [
      "Core Pillar",
      data.pillar.pageTitle,
      data.pillar.searchIntent,
      "N/A",
      "N/A",
      "N/A",
      "N/A", // Pillar doesn't have content angle in same format, or uses description
      "N/A"
    ];

    // Rows 2+: Sub-pillars
    const subPillarRows = data.subPillars.map(sub => [
      "Sub-Pillar",
      `"${sub.primaryKeyword.replace(/"/g, '""')}"`, // Escape quotes
      sub.searchIntent,
      sub.keywordDifficulty,
      `"${sub.semanticKeywords.join("; ")}"`,
      `"${sub.clusterKeywords ? sub.clusterKeywords.join("; ") : ""}"`,
      `"${sub.contentAngle.replace(/"/g, '""')}"`,
      `"${sub.internalLinking.replace(/"/g, '""')}"`
    ]);

    // Combine
    const csvContent = [
      headers.join(","),
      pillarRow.join(","),
      ...subPillarRows.map(row => row.join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `seo-strategy-${topic.replace(/\s+/g, '-').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">SEO Pillar Architect</h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500">
            Powered by Gemini 2.5 Flash & Google Search
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Input Section */}
        <section className="mb-12 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Build Your Authority Content System</h2>
            <p className="text-slate-600 mb-8 text-lg">
                Enter your core topic below. We'll research real-time search data to engineer a 
                structure optimized for Semantic Search, SGE, and Topical Authority.
            </p>
            
            <form onSubmit={handleGenerate} className="relative">
                <div className="relative flex items-center shadow-lg rounded-full overflow-hidden border border-slate-300 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-500 transition-all bg-white p-1">
                    <div className="pl-5 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Sustainable Coffee Farming, Enterprise CRM, Marathon Training"
                        className="w-full px-4 py-4 text-lg text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !topic}
                        className={`mr-1 px-8 py-3 rounded-full font-semibold text-white transition-all
                            ${loading || !topic ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Researching...
                            </div>
                        ) : 'Generate Strategy'}
                    </button>
                </div>
            </form>
        </section>

        {/* Error Message */}
        {error && (
            <div className="max-w-4xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Results */}
        {data && (
            <div className="space-y-8 animate-fade-in">
                
                {/* Actions Bar */}
                <div className="flex justify-end">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Strategy CSV
                    </button>
                </div>

                {/* Pillar Summary Card */}
                <div className="bg-indigo-900 rounded-xl p-8 text-white shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                             <div className="uppercase tracking-wide text-indigo-300 text-sm font-semibold mb-2">Core Authority Page</div>
                             <h2 className="text-3xl font-bold mb-4">{data.pillar.pageTitle}</h2>
                             <p className="text-indigo-100 text-lg leading-relaxed">{data.pillar.topic}</p>
                        </div>
                        <div className="bg-indigo-800 rounded-lg p-6 flex flex-col justify-center space-y-4">
                            <div>
                                <div className="text-xs uppercase text-indigo-300 mb-1">Target Audience</div>
                                <div className="font-medium">{data.pillar.targetAudience}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase text-indigo-300 mb-1">Primary Intent</div>
                                <div className="font-medium flex items-center">
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-sm">
                                        {data.pillar.searchIntent}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Tree */}
                <HierarchyTree pillar={data.pillar} subPillars={data.subPillars} />

                {/* Data Table */}
                <StrategyTable subPillars={data.subPillars} />

                {/* Research Sources */}
                {data.sources && data.sources.length > 0 && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Research Sources</h4>
                        <div className="flex flex-wrap gap-2">
                            {data.sources.map((source, idx) => (
                                <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md transition-colors truncate max-w-[200px]"
                                    title={source.title}
                                >
                                    {source.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
