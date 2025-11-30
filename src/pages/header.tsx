import { BorderBeam } from '@site/src/components/magicui/border-beam';
import { WordRotate } from '@site/src/components/magicui/word-rotate';
import { Button } from '@site/src/components/ui/button';
import { BookOpenIcon, HeartIcon, CloudIcon } from 'lucide-react';
import { cn } from '@site/src/lib/utils';
import { useEffect, useState } from 'react';

export default function Header() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVersion = localStorage.getItem('docs-preferred-version-default');
      setVersion(storedVersion);
    }
  }, []);

  return (
    <header className="container relative flex flex-col items-center justify-center">
      <h1 className="mb-2 text-[60px] font-bold text-indigo-600 dark:text-white">VitoDeploy</h1>
      <WordRotate className="mb-0 text-3xl font-semibold" words={['Open-Source', 'Free', 'Self-Hosted']} />
      <p className="mb-2 text-3xl">Server Management Tool</p>
      <div
        className={cn(
          'relative mt-10 max-h-[480px] overflow-hidden rounded-[12px] border border-border bg-contain bg-center shadow-lg',
          version === '2.x' ? 'bg-[url(/img/services-light.png)]' : 'bg-[url(/img/overview-light.png)]',
          version === '2.x' ? 'dark:bg-[url(/img/services-dark.png)]' : 'dark:bg-[url(/img/overview-dark.png)]',
        )}
      >
        <img
          src={version === '2.x' ? '/img/services-light.png' : '/img/overview-light.png'}
          alt="VitoDeploy"
          className="max-h-[480px] bg-no-repeat opacity-0"
        />
        <BorderBeam size={200} />
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Button size="lg" onClick={() => (window.location.href = '/docs/getting-started/introduction')}>
            <BookOpenIcon className="!size-5" />
            Documentation
          </Button>
          <Button size="lg" variant="secondary" onClick={() => window.open('https://github.com/sponsors/saeedvaziry')}>
            <HeartIcon className="!size-5 text-pink-600" />
            Become Sponsor
          </Button>
        </div>
        <a
          href="https://waitlist.vitodeploy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <CloudIcon className="size-4" />
          Join the Cloud Waitlist
        </a>
      </div>
    </header>
  );
}
