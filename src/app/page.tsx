// Landing page for Drosera Security Traps

'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectKitButton } from 'connectkit';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  ChartBarIcon, 
  CubeIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'One-Click Deployment',
    description: 'Deploy sophisticated security traps with a single click. No coding required.',
    icon: BoltIcon,
  },
  {
    name: 'AI-Powered Analysis',
    description: 'Intelligent contract analysis that identifies vulnerabilities and recommends optimal traps.',
    icon: ChartBarIcon,
  },
  {
    name: 'Template Marketplace',
    description: 'Browse and deploy from a curated collection of audited security trap templates.',
    icon: CubeIcon,
  },
  {
    name: 'Multi-Chain Support',
    description: 'Protect your assets across Ethereum, Polygon, Arbitrum, Base, and more.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Real-Time Monitoring',
    description: '24/7 monitoring with instant alerts when threats are detected.',
    icon: LockClosedIcon,
  },
  {
    name: 'Community Driven',
    description: 'Contribute templates, share strategies, and earn rewards.',
    icon: ShieldCheckIcon,
  },
];

const stats = [
  { name: 'Active Traps', value: '2,847' },
  { name: 'Threats Prevented', value: '156' },
  { name: 'Protected Assets', value: '$47.2M' },
  { name: 'Community Members', value: '12.4K' },
];

const testimonials = [
  {
    content: "Drosera saved our protocol from a devastating flash loan attack. The deployment was incredibly simple.",
    author: "Sarah Chen",
    title: "DeFi Protocol Lead",
    company: "YieldFarm DAO"
  },
  {
    content: "Finally, a security solution that doesn't require a PhD in cryptography to use effectively.",
    author: "Marcus Rodriguez",
    title: "Smart Contract Developer",
    company: "DeFi Labs"
  },
  {
    content: "The AI analysis caught vulnerabilities our audit team missed. Game changer for DeFi security.",
    author: "Dr. Emily Watson",
    title: "Security Researcher",
    company: "Blockchain Security Institute"
  }
];

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Secure Your DeFi Assets with{' '}
              <span className="text-purple-400">Intelligent Traps</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Democratizing access to advanced security tools. Deploy sophisticated protection mechanisms 
              with one click. No coding required, maximum security guaranteed.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/deploy"
                className="rounded-md bg-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors"
              >
                Deploy Your First Trap
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </Link>
              <ConnectKitButton />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-400">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-400">Advanced Security</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to protect your DeFi investments
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            From simple rugpull protection to complex governance attack prevention, 
            Drosera provides the tools you need to secure your assets.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-purple-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-400">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Deploy security in three easy steps
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">Analyze Contract</h3>
              <p className="mt-2 text-base text-gray-300">
                Input your contract address and let our AI analyze it for vulnerabilities
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">Select Traps</h3>
              <p className="mt-2 text-base text-gray-300">
                Choose from recommended security traps or browse our marketplace
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">Deploy & Monitor</h3>
              <p className="mt-2 text-base text-gray-300">
                Deploy with one click and monitor in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-400">Community Trust</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by DeFi protocols worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-3 gap-8 text-sm leading-6 text-gray-300 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <figure key={index} className="col-span-2 hidden sm:block sm:col-span-1">
              <blockquote className="text-lg font-semibold leading-8 text-white">
                "{testimonial.content}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-gray-400">{testimonial.title} at {testimonial.company}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to secure your DeFi assets?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join thousands of users who trust Drosera to protect their investments. 
            Deploy your first security trap in minutes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/deploy"
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              href="/marketplace"
              className="text-lg font-semibold leading-6 text-white hover:text-purple-400 transition-colors"
            >
              Browse Templates <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}