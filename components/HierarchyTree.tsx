import React from 'react';
import { Pillar, SubPillar } from '../types';

interface HierarchyTreeProps {
  pillar: Pillar;
  subPillars: SubPillar[];
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({ pillar, subPillars }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        Structural Hierarchy
      </h3>
      
      <div className="flex flex-col items-center min-w-[800px]">
        {/* Core Pillar Node */}
        <div className="relative z-10 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md font-semibold text-center max-w-md border-2 border-indigo-500">
          <div className="text-xs uppercase tracking-wider opacity-90 mb-1">Core Pillar</div>
          {pillar.pageTitle}
        </div>

        {/* Connector Line */}
        <div className="h-8 w-0.5 bg-slate-300"></div>
        <div className="h-0.5 w-[94%] bg-slate-300"></div>
        
        {/* Vertical Lines Container */}
        <div className="flex justify-between w-[94%] -mt-0.5">
           {subPillars.map((_, i) => (
             <div key={i} className="flex flex-col items-center">
                <div className="h-6 w-0.5 bg-slate-300"></div>
             </div>
           ))}
        </div>

        {/* Sub Pillar Nodes */}
        <div className="flex justify-between w-full mt-0 gap-4">
          {subPillars.map((sub, index) => (
            <div key={index} className="flex-1 min-w-[120px] flex flex-col items-center">
              <div className="bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all p-3 rounded-lg text-xs text-center w-full h-full flex flex-col justify-between relative overflow-hidden group">
                {/* Difficulty Indicator Strip */}
                <div className={`absolute top-0 left-0 w-full h-1 
                  ${sub.keywordDifficulty === 'Hard' ? 'bg-red-400' : 
                    sub.keywordDifficulty === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`} 
                />
                
                <div className="mb-2 pt-1">
                  <span className="font-semibold text-slate-700 line-clamp-2" title={sub.primaryKeyword}>{sub.primaryKeyword}</span>
                </div>
                
                <div className="flex justify-center gap-1 mt-auto">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] inline-block font-medium
                      ${sub.searchIntent === 'Informational' ? 'bg-blue-100 text-blue-700' : 
                        sub.searchIntent === 'Commercial' ? 'bg-purple-100 text-purple-700' : 
                        sub.searchIntent === 'Transactional' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {sub.searchIntent.charAt(0)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] inline-block font-medium border
                      ${sub.keywordDifficulty === 'Hard' ? 'bg-red-50 text-red-700 border-red-100' : 
                        sub.keywordDifficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                      {sub.keywordDifficulty.charAt(0)}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HierarchyTree;
