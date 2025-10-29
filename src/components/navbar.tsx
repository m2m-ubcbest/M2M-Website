"use client";
import Link from "next/link";

/**
 * Navbar component that renders the top navigation bar
 * for the application.
 *
 * @returns {JSX.Element} A responsive navigation bar with logo and links.
 */
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/logo.jpeg" alt="Logo" className="w-12 h-12" />
      </Link>

      <div className="flex space-x-6">
        <Link
          href="/about"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          About
        </Link>
        <Link
          href="/services"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Services
        </Link>
        <Link
          href="/contact"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
