
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { PlatformProfile } from '@/types';
import { LEETCODE_USERNAME, CODEFORCES_USERNAME, CODECHEF_USERNAME, GITHUB_USERNAME, PLATFORM_ICON_MAP } from '@/lib/constants';
import { ExternalLink, Trophy } from 'lucide-react';

const initialProfileData: PlatformProfile[] = [
  {
    id: 'LeetCode',
    name: 'LeetCode',
    username: LEETCODE_USERNAME,
    profileUrl: `https://leetcode.com/${LEETCODE_USERNAME}/`,
    icon: PLATFORM_ICON_MAP['LeetCode'],
    stats: {
      rating: 'N/A',
      problemsSolved: 0,
      contests: 0,
    },
    isLoading: true,
    error: null,
  },
  {
    id: 'Codeforces',
    name: 'Codeforces',
    username: CODEFORCES_USERNAME,
    profileUrl: `https://codeforces.com/profile/${CODEFORCES_USERNAME}`,
    icon: PLATFORM_ICON_MAP['Codeforces'],
    stats: {
      rating: 'N/A',
      rank: 'N/A',
    },
    isLoading: true,
    error: null,
  },
  {
    id: 'CodeChef',
    name: 'CodeChef',
    username: CODECHEF_USERNAME,
    profileUrl: `https://www.codechef.com/users/${CODECHEF_USERNAME}`,
    icon: PLATFORM_ICON_MAP['CodeChef'],
    stats: {
      rating: 'N/A',
      stars: 0,
    },
    isLoading: true,
    error: null,
  },
  {
    id: 'GitHub',
    name: 'GitHub',
    username: GITHUB_USERNAME,
    profileUrl: `https://github.com/${GITHUB_USERNAME}`,
    icon: PLATFORM_ICON_MAP['GitHub'],
    stats: {
      contributionsLastYear: 0,
      publicRepos: 0,
    },
    isLoading: true,
    error: null,
  },
];

export function AchievementsSection() {
  const [profiles, setProfiles] = useState<PlatformProfile[]>(initialProfileData);

  useEffect(() => {
    const fetchCodeforcesData = async () => {
      if (!CODEFORCES_USERNAME || CODEFORCES_USERNAME === "your_codeforces_username") {
        setProfiles(prevProfiles =>
          prevProfiles.map(p =>
            p.id === 'Codeforces' ? { ...p, isLoading: false, error: "Set Codeforces username in constants.ts" } : p
          )
        );
        return;
      }

      setProfiles(prevProfiles =>
        prevProfiles.map(p => (p.id === 'Codeforces' ? { ...p, isLoading: true, error: null } : p))
      );

      try {
        const response = await fetch(`/api/codeforces/${CODEFORCES_USERNAME}`);
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || `Failed to fetch Codeforces data (${response.status})`);
        }

        setProfiles(prevProfiles =>
          prevProfiles.map(p =>
            p.id === 'Codeforces'
              ? { ...p, stats: { rating: data.rating, rank: data.rank }, isLoading: false, error: null }
              : p
          )
        );
      } catch (err: any) {
        setProfiles(prevProfiles =>
          prevProfiles.map(p =>
            p.id === 'Codeforces' ? { ...p, isLoading: false, error: err.message } : p
          )
        );
      }
    };

    fetchCodeforcesData();

    // Simulate data for other platforms
    const simulateOtherPlatforms = async () => {
      // Small delay to allow Codeforces fetch to initiate or complete
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      setProfiles(prevProfiles =>
        prevProfiles.map(profile => {
          // Skip Codeforces as it's fetched live or if it's already loaded/failed
          if (profile.id === 'Codeforces') return profile;
          // If other profiles are already loaded (e.g. from a previous effect run if dependencies change), skip them
          if (!profile.isLoading && profile.error === null && Object.values(profile.stats).some(val => val !== 0 && val !== 'N/A')) {
            return profile;
          }


          let newStats = {};
          let isLoading = profile.isLoading; // Keep original loading state if not simulating this one
          let error = profile.error; // Keep original error state

          switch (profile.id) {
            case 'LeetCode':
              newStats = { rating: 1467, problemsSolved: "60+", contests: 1 };
              isLoading = false; error = null;
              break;
            case 'CodeChef':
              newStats = { rating: 1269, stars: 1 };
              isLoading = false; error = null;
              break;
            case 'GitHub':
              newStats = { contributionsLastYear: 500, publicRepos: 25 };
              isLoading = false; error = null;
              break;
            default:
              newStats = { ...profile.stats };
          }
          // Only update if it was previously loading or had an error and is now being simulated
          if (profile.isLoading || profile.error) {
             return { ...profile, stats: { ...profile.stats, ...newStats }, isLoading, error };
          }
          return profile; // Return unchanged if no simulation applied
        })
      );
    };

    // Simulate other platforms after a short delay to ensure their initial loading state is visible
    const simulationTimer = setTimeout(() => {
        simulateOtherPlatforms();
    }, 1500);


    return () => clearTimeout(simulationTimer);
  }, []);

  return (
    <section id="achievements" className="w-full section-padding bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 flex items-center justify-center">
          <Trophy className="h-10 w-10 text-primary mr-3" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map(profile => (
            <Card key={profile.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <profile.icon className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                </div>
                <CardDescription>@{profile.username === `your_${profile.id.toLowerCase()}_username` ? 'your_username' : profile.username}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                {profile.isLoading ? (
                  <>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    {(profile.id === 'LeetCode' || profile.id === 'GitHub') && <Skeleton className="h-4 w-2/3" />}
                  </>
                ) : profile.error ? (
                    <p className="text-destructive text-sm">{profile.error}</p>
                ) : (
                  <>
                    {profile.stats.rating !== undefined && (
                      <p><strong className="text-accent">Rating:</strong> {profile.stats.rating}</p>
                    )}
                    {profile.stats.problemsSolved !== undefined && (
                      <p><strong className="text-accent">Problems Solved:</strong> {profile.stats.problemsSolved}</p>
                    )}
                    {profile.stats.contests !== undefined && (
                      <p><strong className="text-accent">Contests:</strong> {profile.stats.contests}</p>
                    )}
                    {profile.stats.rank !== undefined && (
                      <p><strong className="text-accent">Rank:</strong> {profile.stats.rank}</p>
                    )}
                    {profile.stats.stars !== undefined && (
                       <p><strong className="text-accent">Stars:</strong> {'★'.repeat(profile.stats.stars || 0)}{'☆'.repeat(Math.max(0, 5-(profile.stats.stars || 0)))}</p>
                    )}
                    {profile.stats.contributionsLastYear !== undefined && (
                      <p><strong className="text-accent">Contributions (Last Year):</strong> {profile.stats.contributionsLastYear}</p>
                    )}
                    {profile.stats.publicRepos !== undefined && (
                      <p><strong className="text-accent">Public Repositories:</strong> {profile.stats.publicRepos}</p>
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent w-full">
                  <Link href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
