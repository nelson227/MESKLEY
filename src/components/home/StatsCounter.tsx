"use client";

import { useEffect, useRef, useState } from "react";
import { Building, Users, Clock, Star } from "lucide-react";

const STATS = [
  { icon: <Building className="w-6 h-6" />, value: 50, suffix: "+", label: "Logements disponibles" },
  { icon: <Users className="w-6 h-6" />, value: 200, suffix: "+", label: "Locataires satisfaits" },
  { icon: <Clock className="w-6 h-6" />, value: 5, suffix: "", label: "Années d'expérience" },
  { icon: <Star className="w-6 h-6" />, value: 98, suffix: "%", label: "Taux de satisfaction" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let current = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-gold">
      {count}{suffix}
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-16 bg-black-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-gray text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
