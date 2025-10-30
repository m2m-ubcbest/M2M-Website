"use client";
interface SupportCardProps {
  sectionRef?: (node: HTMLElement | null) => void;
}

export function SupportCard({ sectionRef }: SupportCardProps) {
  return (
    <section ref={sectionRef} className="section-shell">
      <div className="section-inner relative overflow-hidden rounded-3xl border border-white/70 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-white shadow-xl shadow-slate-900/20 sm:px-10 sm:py-14">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-cover bg-right opacity-20 md:block" />

        <div className="relative max-w-3xl space-y-6">
          <h2 data-animate className="text-3xl font-semibold sm:text-4xl">
            Want to make an impact?
          </h2>
          <p data-animate className="text-base text-slate-200 sm:text-lg">
            Partner with <span className="font-semibold">M2M</span> to advance
            research and development in technologies that empower individuals
            living with Multiple Sclerosis. Whether through sponsorship,
            clinical collaboration, or pilot programs, your support accelerates
            innovation that restores mobility and independence.
          </p>

          <div data-animate className="flex flex-wrap items-center gap-4">
            <a
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
              href="/contact"
            >
              Sponsor Us
            </a>
            <a
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              href="/about"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
