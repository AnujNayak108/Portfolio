
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  tags: string[];
  liveLink?: string;
  repoLink?: string;
}

export type SkillCategory = 'Web Development' | 'Data Science & AI' | 'programming';

export interface Skill {
  name: string;
  icon?: LucideIcon;
  category: SkillCategory;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description?: string;
  Achiements?: string;
}

export interface PlatformProfile {
  id: 'LeetCode' | 'Codeforces' | 'CodeChef' | 'GitHub';
  name: string;
  username: string;
  profileUrl: string;
  icon: LucideIcon;
  stats: {
    rating?: string | number;
    problemsSolved?: number;
    contests?: number;
    rank?: string;
    stars?: number; // CodeChef specific
    contributionsLastYear?: number; // GitHub specific
    publicRepos?: number; // GitHub specific
  };
  isLoading: boolean;
  error?: string | null;
}
