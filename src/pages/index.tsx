import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';
import { BorderBeam } from "../components/magicui/border-beam";
import { Testimonial } from '../components/testimonial';
import styles from './index.module.css';

function Header(): ReactNode {
  const { colorMode } = useColorMode();

  return (
    <header className='container relative flex flex-col items-center justify-center !py-20'>
      <div className="absolute z-[999] -top-80 size-80 rounded-full bg-white/60 blur-[100px] dark:bg-indigo-500"></div>
      <h1 className='!text-[50px] text-indigo-600 dark:text-white'>VitoDeploy</h1>
      <p className='text-3xl !mt-5'>Open-Source, Free and Self-Hosted</p>
      <p className='text-3xl'>Server management tool</p>
      <div className="relative overflow-hidden rounded-lg md:h-[500px] border mt-10">
        <BorderBeam size={400} />
        <img src={
          colorMode === 'dark'
            ? '/img/services-dark.png'
            : '/img/services-light.png'
        } alt="Hero" className="h-full" />
      </div>
    </header>
  )
}

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
      <main>
        <Header />
        <div className="container">
          <Testimonial />
        </div>
      </main>
    </Layout>
  );
}
