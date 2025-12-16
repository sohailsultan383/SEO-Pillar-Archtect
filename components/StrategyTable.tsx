import React, { useState, useMemo } from 'react';
import { SubPillar } from '../types';

interface StrategyTableProps {
  subPillars: SubPillar[];
}

type SortKey = 'primaryKeyword' | 'searchIntent' | 'keywordDifficulty';
type SortDirection = 'asc' | 'desc';

const StrategyTable: React.FC<StrategyTableProps> = ({ subPillars }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSubPillars = useMemo(() => {
    if (!sortConfig) return subPillars;

    const difficultyWeight = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };

    return [...subPillars].sort((a, b) => {
      let aValue: any = a[sortConfig.key];
      let bValue: any = b[sortConfig.key];

      // Custom sort for difficulty
      if (sortConfig.key === 'keywordDifficulty') {
         aValue = difficultyWeight[a.keywordDifficulty] || 0;
         bValue = difficultyWeight[b.keywordDifficulty] || 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [subPillars, sortConfig]);

  const SortIcon = ({ active, direction }: { active: boolean, direction: SortDirection }) => (
    <svg className={`w-3 h-3 ml-1 inline-block transition-opacity ${active ? 'opacity-100 text-indigo-600' : 'opacity-30'}`} fill="currentColor" viewBox="0 0 20 20">
       {active && direction === 'desc' ? (
           <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
       ) : (
           <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
       )}
    </svg>
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Execution Strategy
             </h3>
        </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                onClick={() => handleSort('primaryKeyword')}
              >
                Keyword & Entities
                <SortIcon active={sortConfig?.key === 'primaryKeyword'} direction={sortConfig?.direction || 'asc'} />
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                onClick={() => handleSort('keywordDifficulty')}
              >
                Difficulty
                <SortIcon active={sortConfig?.key === 'keywordDifficulty'} direction={sortConfig?.direction || 'asc'} />
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                onClick={() => handleSort('searchIntent')}
              >
                Intent
                <SortIcon active={sortConfig?.key === 'searchIntent'} direction={sortConfig?.direction || 'asc'} />
              </th>
               <th className="px-6 py-4">Topic Clusters</th>
              <th className="px-6 py-4">SGE Content Angle</th>
              <th className="px-6 py-4">Internal Linking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedSubPillars.map((sub, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 align-top w-1/5">
                  <div className="font-bold text-slate-800 text-base mb-1">{sub.primaryKeyword}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sub.semanticKeywords.map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${sub.keywordDifficulty === 'Hard' ? 'bg-red-50 text-red-600 border border-red-100' : 
                        sub.keywordDifficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                      {sub.keywordDifficulty}
                    </span>
                </td>
                <td className="px-6 py-4 align-top">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${sub.searchIntent === 'Informational' ? 'bg-blue-100 text-blue-800' : 
                      sub.searchIntent === 'Commercial' ? 'bg-purple-100 text-purple-800' : 
                      sub.searchIntent === 'Transactional' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {sub.searchIntent}
                  </span>
                </td>
                 <td className="px-6 py-4 align-top w-1/6">
                   <div className="flex flex-col gap-2">
                      {sub.clusterKeywords && sub.clusterKeywords.length > 0 ? (
                        sub.clusterKeywords.map((cluster, i) => (
                             <div key={i} className="flex items-start gap-1.5">
                                 <svg className="w-3 h-3 text-indigo-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                 <span className="text-xs text-slate-600">{cluster}</span>
                             </div>
                        ))
                      ) : <span className="text-xs text-slate-400 italic">No clusters</span>}
                   </div>
                </td>
                <td className="px-6 py-4 align-top w-1/4">
                  <p className="text-slate-600 text-sm leading-relaxed">{sub.contentAngle}</p>
                </td>
                <td className="px-6 py-4 align-top w-1/6">
                    <div className="flex items-start">
                         <svg className="w-4 h-4 text-indigo-400 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                         <span className="text-slate-600 italic text-xs">{sub.internalLinking}</span>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StrategyTable;
