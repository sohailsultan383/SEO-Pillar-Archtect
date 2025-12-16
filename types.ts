export interface SubPillar {
  primaryKeyword: string;
  semanticKeywords: string[];
  clusterKeywords: string[];
  keywordDifficulty: 'Easy' | 'Medium' | 'Hard';
  searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  contentAngle: string;
  internalLinking: string;
}

export interface Pillar {
  topic: string;
  pageTitle: string;
  searchIntent: string;
  targetAudience: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface SEOStrategy {
  pillar: Pillar;
  subPillars: SubPillar[];
  sources: Source[];
}
