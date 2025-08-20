'use client';

import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Stats } from '../components/Stats';
import { Features } from '../components/Features';
import { BackendStatus } from '../components/BackendStatus';
import { Donation } from '../components/Donation';
import { Footer } from '../components/Footer';

export default function Home() {

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <Hero />
        <Stats />
        <Features />
        <BackendStatus />
        <Donation />
      </main>

      <Footer />
    </div>
  );
}

