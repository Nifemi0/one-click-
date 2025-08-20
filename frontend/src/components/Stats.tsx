'use client';

import { Shield, Target, Clock, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: Shield,
    value: "1,234+",
    label: "Security Traps Deployed",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Zap,
    value: "150+",
    label: "Active Deployments",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Target,
    value: "99.9%",
    label: "Attack Prevention Rate",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Monitoring Active",
    color: "from-orange-500 to-red-600"
  }
];

export function Stats() {
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const animateCounters = () => {
      stats.forEach((stat, index) => {
        setTimeout(() => {
          if (stat.value.includes('+') || stat.value.includes('%') || stat.value.includes('/')) {
            // For non-numeric values, just show them immediately
            setAnimatedValues(prev => ({ ...prev, [index]: 1 }));
          } else {
            // For numeric values, animate them
            const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericValue)) {
              let current = 0;
              const increment = numericValue / 50;
              const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                  current = numericValue;
                  clearInterval(timer);
                }
                setAnimatedValues(prev => ({ ...prev, [index]: current }));
              }, 20);
            }
          }
        }, index * 200);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className="section relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-accent/10 to-accent-hover/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-accent-hover/10 to-accent/10 rounded-full blur-3xl animate-float-delay-1"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="mb-6">
            <span className="gradient-text">
              Security Metrics
            </span>
          </h2>
          <p className="text-xl text-muted container-sm">
            Real-time statistics showcasing our platform's security effectiveness
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid-responsive">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const animatedValue = animatedValues[index];
            
            return (
              <div
                key={index}
                className="group relative"
              >
                <div className="card card-hover h-full">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-hover/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-accent/20 to-accent-hover/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-accent/30 group-hover:to-accent-hover/30 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-accent group-hover:text-accent-hover transition-colors duration-500" />
                  </div>
                  
                  {/* Value */}
                  <div className="relative z-10 mb-4">
                    <div className="text-3xl md:text-4xl font-bold gradient-text">
                      {stat.value.includes('+') || stat.value.includes('%') || stat.value.includes('/') 
                        ? stat.value 
                        : animatedValue 
                          ? `${Math.floor(animatedValue).toLocaleString()}${stat.value.includes('M') ? 'M' : ''}`
                          : '0'
                      }
                    </div>
                  </div>
                  
                  {/* Label */}
                  <p className="relative z-10 text-muted text-center leading-relaxed group-hover:text-foreground transition-colors duration-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
