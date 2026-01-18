'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { translations } from '@/constants/translations'
import { Menu, X, Code2 } from 'lucide-react'

export const Navbar = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = translations[lang]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#about', label: t.about.title },
    { href: '#projects', label: t.repoTitle.split('&')[0].trim() }, // Pega a primeira palavra
    { href: '#articles', label: t.categories.articles.split('.')[1].trim() },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="main-container flex justify-between items-center">
        {/* Logo / Nome */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
            <Code2 size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
            SÉRGIO<span className="text-blue-600">SANTOS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={`/${lang}${link.href}`}
              className="text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={`/${lang}${link.href}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
