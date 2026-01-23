'use client';

import React from 'react';
import {
  Linkedin,
  Github,
  Mail,
  Globe,
  Code2,
  ExternalLink,
  Blocks,
} from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface FooterProps {
  lang: Locale;
  dict: {
    about?: {
      headline?: string;
    };
    footer?: {
      location?: string;
      socialTitle?: string;
      contactTitle?: string;
      rights?: string;
      builtBy?: string;
      emailLabel?: string;
      stackLabel?: string;
    };
  };
}

/**
 * FOOTER — RESPONSIVO • MULTILÍNGUE • PRODUÇÃO
 */
export const Footer = ({ lang, dict }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const email = 'santossergiorealbjj@outlook.com';
  const linkedinUrl = 'https://www.linkedin.com/in/santossergioluiz';
  const githubUrl = 'https://github.com/Santosdevbjj';

  const about = dict?.about || {};
  const footer = dict?.footer || {};

  /** Fallbacks multilíngues seguros */
  const fallbacks = {
    pt: {
      location: 'Brasil',
      social: 'Redes Sociais',
      contact: 'Contato',
      rights: 'Todos os direitos reservados',
      builtBy: 'Desenvolvido por',
      email: 'Email',
      stack: 'Stack',
      headline: 'Especialista em Dados & Governança',
    },
    en: {
      location: 'Brazil',
      social: 'Social Media',
      contact: 'Contact',
      rights: 'All rights reserved',
      builtBy: 'Developed by',
      email: 'Email',
      stack: 'Stack',
      headline: 'Data Specialist & Governance Expert',
    },
    es: {
      location: 'Brasil',
      social: 'Redes Sociales',
      contact: 'Contacto',
      rights: 'Todos los derechos reservados',
      builtBy: 'Desarrollado por',
      email: 'Correo',
      stack: 'Stack',
      headline: 'Especialista en Datos y Gobernanza',
    },
  }[lang];

  return (
    <footer className="bg-slate-50 dark:bg-[#020617] pt-24 pb-12 border-t border-slate-200 dark:border-slate-800/60 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* IDENTIDADE */}
          <div className="md:col-span-2">
            <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white mb-6 block uppercase">
              Sérgio
              <span className="text-blue-600">Santos</span>
            </span>

            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium text-base mb-8">
              {about?.headline || fallbacks.headline}
            </p>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Globe className="w-4 h-4 text-blue-500 animate-pulse" />
              {footer?.location || fallbacks.location}
            </div>
          </div>

          {/* REDES SOCIAIS */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[10px] opacity-60">
              {footer?.socialTitle || fallbacks.social}
            </h4>

            <ul className="flex flex-col gap-5">
              <SocialLink href={linkedinUrl} label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </SocialLink>

              <SocialLink href={githubUrl} label="GitHub">
                <Github className="w-4 h-4" />
              </SocialLink>
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-8 uppercase tracking-[0.2em] text-[10px] opacity-60">
              {footer?.contactTitle || fallbacks.contact}
            </h4>

            <a href={`mailto:${email}`} className="group flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-blue-600 transition-colors font-bold text-sm">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{footer?.emailLabel || fallbacks.email}</span>
              </div>

              <span className="text-[10px] md:text-xs font-bold text-slate-400 break-all bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-2xl">
                {email}
              </span>
            </a>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800/80 flex flex-col xl:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2 items-center xl:items-start text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center xl:text-left">
            <p>
              © {currentYear} • {footer?.rights || fallbacks.rights}
            </p>
            <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Code2 className="w-4 h-4" />
              {footer?.builtBy || fallbacks.builtBy}{' '}
              <span className="text-slate-900 dark:text-white ml-1">
                Sérgio Santos
              </span>
            </p>
          </div>

          {/* STACK */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900/50 px-6 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 pr-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 pb-2 sm:pb-0">
              <Blocks className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black uppercase">
                {footer?.stackLabel || fallbacks.stack}
              </span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-[9px] font-bold text-slate-500 uppercase">
              <span>Next.js 15</span>
              <Dot />
              <span>React 19</span>
              <Dot />
              <span>Tailwind</span>
              <Dot />
              <span>TypeScript</span>
              <Dot />
              <span>Lucide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ---------- COMPONENTES AUXILIARES ---------- */

const SocialLink = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm"
    >
      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {children}
      </div>
      <span>{label}</span>
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
    </a>
  </li>
);

const Dot = () => (
  <span className="w-1 h-1 bg-blue-600/30 rounded-full shrink-0" />
);
