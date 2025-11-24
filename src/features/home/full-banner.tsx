"use client";

import { InfoCard } from "./info-card";
import { pathways } from "@/data/home";

interface FullBannerProps {
  sectionRef?: (node: HTMLElement | null) => void;
}

export function FullBanner({ sectionRef }: FullBannerProps) {
  return (
    <section
      ref={sectionRef}
      className="full-bleed glass-panel-xs px-4 py-12 sm:px-10 sm:py-20 rounded-none"
    >
      <div className="section-inner mx-auto flex w-full flex-col items-center text-center">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2
            data-animate
            className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
          >
            Advancing mobility and independence through intelligent technology
          </h2>
          <p
            data-animate
            className="text-base text-slate-600 sm:text-lg dark:text-slate-400"
          >
            At M2M, we design and build innovative software and hardware
            solutions that empower individuals living with Multiple Sclerosis.
            Our mission is to enhance daily mobility, accessibility, and
            confidence through thoughtful, human-centered engineering.
          </p>
        </div>
        <div className="mx-auto mt-12 grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {pathways.map((pathway) => (
            <InfoCard
              key={pathway.title}
              title={pathway.title}
              caption={pathway.description}
              className="bg-white/70 dark:bg-slate-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
