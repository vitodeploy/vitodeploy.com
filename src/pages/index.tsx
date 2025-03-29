import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Features from './features';
import Header from './header';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const headerFeatures = [
    "PHP App",
    "Database",
    "Load Balancer",
  ]

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main className='relative'>
        <div className="absolute z-[999] -top-80 left-[50%] translate-x-[-50%] size-[300px] rounded-full bg-white/60 blur-[100px] dark:bg-indigo-500"></div>
        <div className="container mx-auto py-10 space-y-20">
          <Header />
          <Features />
        </div>
      </main>
    </Layout>
  );
}
