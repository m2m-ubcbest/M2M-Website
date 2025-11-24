"use client";

interface InfoCardProps {
  title: string;
  caption: string;
  stepLabel?: string;
  className?: string;
}

/**
 * A glassy, rounded step card component.
 * Displays an optional step label, a title, and a caption.
 */
export function InfoCard({
  title,
  caption,
  stepLabel,
  className,
}: InfoCardProps) {
  const baseClass = "glass-card p-5";

  return (
    <div
      data-animate
      className={className ? `${baseClass} ${className}` : baseClass}
    >
      {stepLabel && (
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Step {stepLabel}
        </div>
      )}

      <h3
        className={`${
          stepLabel ? "mt-2" : ""
        } text-lg font-semibold text-slate-900`}
      >
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-slate-600">{caption}</p>
    </div>
  );
}
