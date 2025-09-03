'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Donation from '@/components/Donation';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Stats Section */}
      <Stats />
      
      {/* Donation Section */}
      <Donation />
      
      {/* Contact Section */}
      <Contact />
    </main>
  );
}

