"use client";

import { animate, stagger } from "animejs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks } from "@/data/navlinks";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const setLinkRef = useCallback(
    (index: number) => (el: HTMLAnchorElement | null) => {
      linkRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    const links = linkRefs.current.filter((link): link is HTMLAnchorElement =>
      Boolean(link)
    );

    if (!overlay) {
      return;
    }

    const animateOpen = () => {
      overlay.style.pointerEvents = "auto";
      animate(overlay, {
        opacity: [0, 1],
        duration: 320,
        easing: "easeOutCubic",
      });

      if (links.length) {
        animate(links, {
          opacity: [0, 1],
          translateY: [16, 0],
          easing: "easeOutCubic",
          duration: 380,
          delay: stagger(90, { start: 120 }),
        });
      }

      document.body.style.overflow = "hidden";
    };

    const animateClose = () => {
      if (links.length) {
        animate(links, {
          opacity: [1, 0],
          translateY: [0, -16],
          easing: "easeInCubic",
          duration: 220,
          delay: stagger(70),
        });
      }

      animate(overlay, {
        opacity: 0,
        translateY: -24,
        easing: "easeInQuart",
        duration: 260,
        complete: () => {
          overlay.style.pointerEvents = "none";
          setIsMenuVisible(false);
          linkRefs.current = [];
        },
      });

      document.body.style.overflow = "";
    };

    if (isMenuOpen) {
      animateOpen();
    } else if (isMenuVisible) {
      animateClose();
    }
  }, [isMenuOpen, isMenuVisible]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOpenMenu = () => {
    if (isMenuOpen) return;
    setIsMenuVisible(true);
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    if (!isMenuOpen) return;
    setIsMenuOpen(false);
  };

  const handleNavigate = () => {
    handleCloseMenu();
  };

  return (
    <>
      <nav className="fixed xl:top-6 left-1/2 z-50 flex w-full xl:w-max-6xl xl:max-w-6xl -translate-x-1/2 items-center justify-between xl:rounded-full overflow-hidden border border-white/50 bg-white/10 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/m2m-logo.svg" alt="M2M Logo" className="max-h-10" />
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-gray-400 transition-colors ease-in-out hover:text-[#90BFFF]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={handleOpenMenu}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white/10 text-white outline-none transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="absolute h-0.5 w-5 -translate-y-2.5 rounded-full bg-gray-300 transition-transform duration-300" />
          <span className="absolute h-0.5 w-5 rounded-full bg-gray-300 transition-opacity duration-300" />
          <span className="absolute h-0.5 w-5 translate-y-2.5 rounded-full bg-gray-300 transition-transform duration-300" />
        </button>
      </nav>

      {isMenuVisible && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex flex-col text-white backdrop-blur-xl"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              onClick={handleNavigate}
              className="flex items-center"
            >
              <img src="/m2m-logo.svg" alt="M2M" className="max-h-8" />
            </Link>
            <button
              type="button"
              onClick={handleCloseMenu}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/30 bg-black/10 text-black transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-label="Close navigation menu"
            >
              <span className="absolute h-0.5 w-5 rotate-45 rounded-full bg-current" />
              <span className="absolute h-0.5 w-5 -rotate-45 rounded-full bg-current" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 text-center text-3xl font-semibold">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                ref={setLinkRef(index)}
                onClick={handleNavigate}
                className="text-black/80 transition hover:text-[#90BFFF]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
