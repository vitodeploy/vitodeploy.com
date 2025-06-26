import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Features from './features';
import Header from './header';
import { Testimonial } from '../components/testimonial';
import { JSX } from 'react';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const headerFeatures = ['PHP App', 'Database', 'Load Balancer'];

  return (
    <Layout title={`Self-Hosted Server Management Tool`} description="Free, Open-Source, and Self-Hosted Server Management Tool">
      <main className="relative">
        <div className="absolute -top-80 left-[50%] z-[999] size-[300px] translate-x-[-50%] rounded-full bg-white/60 blur-[100px] dark:bg-indigo-500"></div>
        <div className="container mx-auto space-y-10 py-10">
          <Header />
          <Features />
          <Testimonial />
        </div>
      </main>
    </Layout>
  );
}
