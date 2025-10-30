"use client";

import { WaterDropGrid } from "@/features/home/water-drop-grid";
import { animate, set, stagger } from "animejs";
import { useEffect, useRef } from "react";
import { FeatureSection } from "@/features/home/feature-card";
import { SupportCard } from "@/features/home/support-card";
import { m2mAppSteps, gameControllerSteps, physioAppSteps } from "@/data/home";
import { Hero } from "@/features/home/hero";
import { FullBanner } from "@/features/home/full-banner";
import ThreeDisplay from "@/components/three-display";

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const sections = sectionRefs.current.filter(
      (section): section is HTMLElement => Boolean(section)
    );

    const primeTargets = (elements: NodeListOf<Element>) => {
      set(elements, { opacity: 0, translateY: 48, rotateX: -6 });
    };

    const revealTargets = (
      elements: NodeListOf<Element>,
      sectionIndex: number
    ) =>
      animate(elements, {
        opacity: 1,
        translateY: 0,
        rotateX: 0,
        easing: "easeOutExpo",
        duration: 900,
        delay: stagger(100, { start: sectionIndex * 100 }),
      });

    if (reduceMotionQuery.matches) {
      sections.forEach((section) => {
        const targets = section.querySelectorAll("[data-animate]");
        set(targets, { opacity: 1, translateY: 0, rotateX: 0 });
      });
      return;
    }

    const observers: IntersectionObserver[] = [];

    sections.forEach((section, sectionIndex) => {
      const targets = section.querySelectorAll("[data-animate]");
      if (!targets.length) {
        return;
      }

      primeTargets(targets);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealTargets(targets, sectionIndex);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="relative z-10 overflow-hidden flex flex-col gap-8">
      <WaterDropGrid />

      <Hero sectionRef={setSectionRef(0)} />

      <FullBanner sectionRef={setSectionRef(1)} />

      <FeatureSection
        sectionRef={setSectionRef(2)}
        label="Software"
        title="M2M Mobile Application"
        description="Our application is currently undergoing step 2 of development."
        steps={m2mAppSteps}
      />

      <FeatureSection
        sectionRef={setSectionRef(4)}
        label="Hardware"
        title="Game Pad"
        description="Our hardware is currently undergoing step 2 of development."
        steps={gameControllerSteps}
        reverse
      />

      <FeatureSection
        sectionRef={setSectionRef(5)}
        label="Software"
        title="Physio App"
        description="Our hardware is currently undergoing step 2 of development."
        steps={physioAppSteps}
      />
      <SupportCard sectionRef={setSectionRef(6)} />
    </div>
  );
}
