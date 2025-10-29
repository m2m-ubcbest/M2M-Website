"use client";

import Footer from "./footer";
import Navbar from "./navbar";
import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * LayoutWrapper component provides a consistent page structure
 * that includes a top navigation bar, a footer, and a main content area.
 *
 * @param {Object} props - The props for the LayoutWrapper component.
 * @param {ReactNode} props.children - The main content to display within the layout.
 * @param {string} [props.className] - Optional additional Tailwind CSS classes for the main content area.
 *
 * @returns {JSX.Element} The rendered layout component with a navbar, footer, and page content wrapper.
 */

export default function LayoutWrapper({
  children,
  className,
}: LayoutWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className={`flex-1 px-6 py-8 ${className}`}>
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
