"use client";
import { heroStats } from "@/data/home";

interface HeroProps {
  sectionRef?: (node: HTMLElement | null) => void;
}

export function Hero({ sectionRef }: HeroProps) {
  return (
    <section
      ref={sectionRef}
      className="section-shell pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40"
    >
      <div className="section-inner flex flex-col gap-12 sm:gap-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-8">
          <span
            data-animate
            className="inline-flex max-w-max items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200 backdrop-blur"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Insert something here
          </span>
          <h1
            data-animate
            className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
          >
            Muscle to Movement
          </h1>
          <p
            data-animate
            className="max-w-xl text-base text-slate-600 sm:text-lg dark:text-slate-400"
          >
            Muscle to Movement (M2M) aims to enhance and assist in the
            rehabilitation for multiple sclerosis patients through product
            hardware and software systems
          </p>
          <div data-animate className="flex flex-wrap items-center gap-4">
            <a
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-700 dark:border dark:border-slate-500"
              href="/about"
            >
              Learn about M2M
            </a>
            <a
              className="rounded-full border border-slate-900/20 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-900/50 hover:bg-white"
              href="/contact"
            >
              Meet the team
            </a>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-6 lg:max-w-sm">
          <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                data-animate
                className="rounded-3xl border border-white/25 p-6 text-center glass-card"
              >
                <div className="text-3xl font-semibold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
