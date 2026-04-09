"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/wiki', label: '위키 가이드' },
  { href: '/builder', label: '태그 빌더' },
  { href: '/lab', label: '프롬프트 연구소' },
  { href: '/score', label: '품질 점수기' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl transition-all duration-300 ${
      mounted && scrolled ? 'scale-95 translate-y-[-10px]' : ''
    }`}>
      <div className={`glass-card px-6 py-4 flex items-center justify-between transition-all duration-300 ${
        mounted && scrolled ? 'bg-slate-900/90 backdrop-blur-2xl border-brand-yellow/30 shadow-2xl shadow-brand-yellow/5' : ''
      }`}>
        <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-3 z-10 w-1/4">
          <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
          Prompt LAB
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm font-bold text-slate-400">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-slate-100 transition-colors py-2 ${
                pathname === link.href ? 'text-brand-yellow' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="w-1/4 hidden md:flex justify-end" />

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-200 z-20"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 glass-card px-6 py-6 flex flex-col gap-4 shadow-2xl shadow-black/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-base font-bold py-2 transition-colors ${
                pathname === link.href ? 'text-brand-yellow' : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
