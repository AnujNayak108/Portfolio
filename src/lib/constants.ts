
import type { NavItem, Project, Skill, EducationEntry } from '@/types';
import { url } from 'inspector';
import { Briefcase, Code, GraduationCap, Mail, Home, Rocket, Brain, School, UserCircle2, Trophy, Swords, Users, ChefHat, Github } from 'lucide-react';
import test from 'node:test';

export const NAV_ITEMS: NavItem[] = [
  { href: '#hero', label: 'Home', icon: Home },
  { href: '#about', label: 'About', icon: UserCircle2 },
  { href: '#projects', label: 'Projects', icon: Rocket },
  { href: '#skills', label: 'Skills', icon: Brain },
  { href: '#education', label: 'Education', icon: School },
  { href: '#achievements', label: 'Achievements', icon: Trophy },
  { href: '#contact', label: 'Contact', icon: Mail },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'project-1',
    title: 'EDC-BITM',
    description: 'Developed and managed the official website of EDC BIT Mesra, a dynamic platform showcasing entrepreneurial initiatives, events like E-Summit, and startup support programs, with a focus on interactive design, scalability, and user engagement',
    imageUrl: '/pj1.png' ,
    dataAiHint: 'nebula space',
    tags: ['React.js', 'Tailwind CSS', 'JavaScript', 'Node.js'],
    liveLink: 'https://edcbitmesra.in/',
    repoLink: 'https://github.com/EDC-BITM/EDC-BITM',
  },
  {
    id: 'project-2',
    title: "Esummit'25",
    description: 'Developed and maintained the official E‑Summit ’25 website — the digital face of BIT Mesra’s flagship entrepreneurship summit, featuring speaker profiles, event schedules, registration portals, and interactive ticketing tailored for high engagement and startup ecosystem support.',
    imageUrl: '/pj2.gif',
    dataAiHint: 'galaxy map',
    tags: ['React.js', 'Tailwind CSS', 'JavaScript', 'Node.js'],
    liveLink: 'https://esummit.edcbitmesra.in/',
    repoLink: 'https://github.com/EDC-BITM/E-Summit-2025',
  },
  {
    id: 'project-3',
    title: 'Customer Support',
    description: 'Developed a full-stack customer handling web application featuring real-time chat, secure user authentication, and an AI Copilot for automated support — built with React, Node.js, Express, and MongoDB, with WebSocket integration and RESTful APIs to ensure seamless communication and scalability.',
    imageUrl: '/pj3.png',
    dataAiHint: 'portfolio website',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Node.js' , 'Express.js' , 'MongoDB' , 'AI Copilot'],
    liveLink: 'https://customer-support-platform-lilac.vercel.app/',
    repoLink: 'https://github.com/AnujNayak108/customer-support-platform',
  },
];

export const SKILLS_DATA: Skill[] = [
  { name: 'TypeScript', icon: Code, category: 'Web Development' },
  { name: 'React / Next.js', icon: Code, category: 'Web Development' },
  { name: 'Node.js', icon: Code, category: 'Web Development' },
  { name: 'Python', icon: Code, category: 'programming' },
  { name: 'Generative AI (Genkit)', icon: Brain, category: 'Data Science & AI' },
  { name: 'UI/UX Design', icon: UserCircle2, category: 'Web Development' },
  { name: 'Firebase', icon: Code, category: 'Web Development' },
  { name: 'Tailwind CSS', icon: Code, category: 'Web Development' },
  { name: 'GraphQL', icon: Code, category: 'Web Development' },
  { name: 'Docker', icon: Code, category: 'Web Development' },
  { name: 'Express.js', icon: Code, category: 'Web Development' },
  { name: 'MongoDB', icon: Code, category: 'Web Development' },
  { name: 'SQL', icon: Code, category: 'Web Development' },
  { name: 'Git & GitHub', icon: Github, category: 'Web Development' },
  { name : 'Tailwindcss', icon: Code, category: 'Web Development' },
  { name: 'Numpy', icon: Code, category: 'Data Science & AI' },
  { name: 'Pandas', icon: Code, category: 'Data Science & AI' },
  { name: 'Scikit-learn', icon: Code, category: 'Data Science & AI' },
  { name: 'TensorFlow', icon: Code, category: 'Data Science & AI' },
  { name: 'PyTorch', icon: Code, category: 'Data Science & AI' },
  { name : 'Google-colab', icon: Code, category: 'Data Science & AI' },
  { name: 'C++', icon: Code, category: 'programming' },
  { name: 'C', icon: Code, category: 'programming' },
  { name : 'Java', icon: Code, category: 'programming' },
  { name: 'HTML', icon: Code, category: 'Web Development' },
  { name: 'CSS', icon: Code, category: 'Web Development' },
  { name: 'JavaScript', icon: Code, category: 'programming' },
  { name: 'Postman' , icon: Code, category: 'Web Development'},
];

export const EDUCATION_DATA: EducationEntry[] = [
  {
    id: 'edu-1',
    institution: 'Birla Institute of Technology , Mesra',
    degree: 'IMSc in Mathematics & Computer Science',
    period: '2023 - 2028',
    description: 'Coursework : Programming for problem solving,  Data Structure and Algorithm, Object-oriented programming,  Algebra,  Discrete mathematics,  Graph Theory , Java, C.',
    Achiements: '',
  },
  {
    id: 'edu-2',
    institution: 'Kendriya Vidyalaya , Kusmunda',
    degree: 'Senior Secondary Education (Science)',
    period: '2011 - 2023',
    description: 'Coursework : Mathematics, Physics, Chemistry',
    Achiements: 'Achiements : RMO(Regional Maths Olympiad) Qualified, Social Science Exhibition Finalist',
  },
];

export const OWNER_NAME = " Anuj Nayak ";
export const OWNER_TITLE = " Mathematics Explorer";
//export const BASE_BIO = " > Loading personality... ██████████ 100% > Environment detected: Cold outside, code inside ❄️> Core modules: Mathematics, Music, Midnight Creativity> Side quests: Piano solos, Drum battles, Debugging life> Background task: Lo-fi beats & deep thoughts running> Error 404: Sleep not found> Dependencies: Caffeine, Curiosity, Quiet nights> Mission: Turn caffeine into code and chaos into creation> Objective: Build cool things. Stay warm.> System status: ✨ Running with rhythm and just a bit of jazz.";

// Add your competitive programming and GitHub IDs here
export const LEETCODE_USERNAME = "PD2WursKvf";
export const CODEFORCES_USERNAME = "binaryspot";
export const CODECHEF_USERNAME = "binaryspot08";
export const GITHUB_USERNAME = "anujnayak108";

export const PLATFORM_ICON_MAP = {
  LeetCode: Swords,
  Codeforces: Users,
  CodeChef: ChefHat,
  GitHub: Github,
};
