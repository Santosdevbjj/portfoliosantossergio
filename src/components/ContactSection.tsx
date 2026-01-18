'use client'

import React from 'react';
import { translations } from '@/constants/translations';
import { Mail, Linkedin, Github, ArrowRight, MessageSquare, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const ContactSection = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const email = "sergiosantosluiz@gmail.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Textos auxiliares baseados no idioma
  const contactText = {
    pt: { title: "Vamos conversar?", sub: "Disponível para projetos estratégicos e consultoria em dados.", button: "Enviar E-mail" },
    en: { title: "Let's talk?", sub: "Available for strategic projects and data consultancy.", button: "Send Email" },
    es: { title: "¿Hablamos?", sub: "Disponible para proyectos estratégicos y consultoría de datos.", button: "Enviar Correo" }
  }[lang];

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Decorativo Estilo Grid de Dados */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      
      <div className="main-container relative z-10">
        <div className="bg-blue-600 rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
          
          {/* Círculos decorativos internos */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl" />

          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
              {contactText.title}
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              {contactText.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all hover:scale-105"
              >
                <Mail size={20} />
                {contactText.button}
              </a>
              
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all"
              >
                {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                {email}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full lg:w-auto">
            <div className="bg-blue-700/50 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">Redes Profissionais</p>
              <div className="flex gap-4">
                <a href="https://linkedin.com/in/santos-sergio" target="_blank" className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                  <Linkedin size={24} />
                </a>
                <a href="https://github.com/Santosdevbjj" target="_blank" className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                  <Github size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé de Encerramento da Seção */}
        <div className="mt-20 text-center text-slate-400">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-mono mb-4">
            <MessageSquare size={14} className="text-blue-500" />
            <span>Open for new challenges 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};
