import React, { useEffect, useState } from 'react';

interface Contributor {
  id: number;
  username: string;
  contributions: number;
  avatar_url: string;
}

interface CacheData {
  contributors: Contributor[];
  timestamp: number;
}

const CACHE_KEY = 'vitodeploy_contributors';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  // Cache helper functions
  const getCachedData = (): CacheData | null => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      // Validate the structure
      if (!parsed || !Array.isArray(parsed.contributors) || typeof parsed.timestamp !== 'number') {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const setCachedData = (data: Contributor[]) => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const cacheData: CacheData = {
        contributors: data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Ignore localStorage errors
    }
  };

  const isCacheValid = (cacheData: CacheData): boolean => {
    return Date.now() - cacheData.timestamp < CACHE_DURATION;
  };

  const fromRepo = async (repo: string) => {
    try {
      const res = await fetch(`https://api.github.com/repos/vitodeploy/${repo}/contributors`);
      return await res.json();
    } catch {
      return [];
    }
  };

  const getContributors = async () => {
    // Check cache first
    const cachedData = getCachedData();

    // Check cache and use if valid
    if (cachedData && isCacheValid(cachedData)) {
      setContributors(cachedData.contributors);
      return;
    }

    const users = await Promise.all([fromRepo('vito')]);

    // merge contributors
    const merged = users
      .reduce((acc: any[], data: any[] = []) => {
        if (!Array.isArray(data)) return acc;
        return [...acc, ...data.filter((i) => i.login)];
      }, [])
      .reduce((acc: Contributor[], user: any) => {
        const existingUser = acc.find((u) => u.id === user.id);

        if (existingUser) {
          existingUser.contributions += user.contributions;
          return acc;
        }

        return [
          ...acc,
          {
            id: user.id,
            username: user.login,
            contributions: user.contributions,
            avatar_url: user.avatar_url,
          },
        ];
      }, []);

    console.log('Merged contributors:', merged.length, 'contributors');
    setContributors(merged);
    setCachedData(merged);
  };

  useEffect(() => {
    getContributors();
  }, []);

  return (
    <div className="py-10">
      <h2 className="text-center text-4xl">Contributors</h2>
      <p className="text-center text-lg text-gray-700 dark:text-gray-400">These amazing people have contributed to VitoDeploy!</p>
      <div className="my-10 px-5 text-center text-lg leading-7">
        <div className="flex flex-wrap gap-2">
          {contributors.map((contributor) => (
            <a
              key={contributor.id}
              href={`https://github.com/${contributor.username}`}
              aria-label={contributor.username}
              rel="noopener noreferrer"
              target="_blank"
              title={contributor.username} // instead of v-tooltip
            >
              <img
                src={contributor.avatar_url}
                alt={contributor.username}
                aria-label={contributor.username}
                loading="lazy"
                width={50}
                height={50}
                className="w-15 h-15 min-w-15 min-h-15 rounded-full"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributors;
