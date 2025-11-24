"use client";

import ThreeDisplay, { ThreeDisplayProps } from "@/components/three-display";
import { InfoCard } from "./info-card";

type Step = {
  title: string;
  caption: string;
};

export interface FeatureSectionProps extends ThreeDisplayProps {
  label: string;
  title: string;
  description: string;
  steps: Step[];
  sectionRef?: (node: HTMLElement | null) => void;
  reverse?: boolean;
}

/**
 * Reusable feature section for software/hardware showcase
 */
export function FeatureSection({
  label,
  title,
  description,
  steps,
  sectionRef,
  reverse = false,
  ...ThreeModel
}: FeatureSectionProps) {
  return (
    <section ref={sectionRef} className="section-shell">
      <div
        className={`section-inner relative overflow-hidden glass-panel-xs p-8 sm:p-10 lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-14`}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-white/30 via-white/10 to-white/0 opacity-60" />

        {/* Left column (text + steps) */}
        <div
          className={`flex flex-col justify-between space-y-6 ${
            reverse ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <span
            data-animate
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white w-fit"
          >
            {label}
          </span>
          <div className="space-y-6">
            <h2
              data-animate
              className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
            >
              {title}
            </h2>
            <p
              data-animate
              className="text-base text-slate-600 dark:text-slate-400 sm:text-lg"
            >
              {description}
            </p>
          </div>
          <div className="grid gap-6">
            {steps.map((step, index) => (
              <InfoCard
                key={step.title}
                title={step.title}
                caption={step.caption}
                stepLabel={(index + 1).toString()}
                className="bg-white dark:bg-slate-200"
              />
            ))}
          </div>
        </div>

        {/* Right column (dark card) */}
        <div
          className={`flex flex-col justify-between gap-6 rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg ${
            reverse ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div data-animate className="space-y-4">
            <h3 className="text-2xl font-semibold">Available soon</h3>
            <p className="text-sm text-slate-200/80">Stay tuned for updates</p>
          </div>
          <div
            data-animate
            className="relative h-120 w-full overflow-hidden rounded-2xl "
          >
            <ThreeDisplay
              className="absolute inset-0"
              style={{ width: "100%", height: "100%" }}
              fileName={ThreeModel.fileName}
              elevationAngle={ThreeModel.elevationAngle}
              zoomMultiplier={ThreeModel.zoomMultiplier}
            />
          </div>
          <div data-animate className="space-y-1 text-sm text-slate-200/80">
            <p className="font-semibold text-white">More details coming soon</p>
            <p>We’re polishing everything for release.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
