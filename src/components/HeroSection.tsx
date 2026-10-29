"use client";

import React from "react";
import { CalendarCheck, Clock, Star, Sparkles, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  onStartBooking: () => void;
}

export function HeroSection({ onStartBooking }: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Luz de fundo decorativa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 dark:bg-amber-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Experiência Premium em Barbearia & Estética</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-tight md:leading-[1.15]">
          Agende seu horário com os melhores profissionais em{" "}
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
            menos de 1 minuto
          </span>
          .
        </h1>

        {/* Subtítulo */}
        <p className="mt-5 text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Sem filas, sem espera por WhatsApp. Escolha o serviço, selecione seu barbeiro de confiança e confirme seu horário em tempo real.
        </p>

        {/* Botão Principal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartBooking}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Escolher Serviço & Agendar</span>
          </button>
        </div>

        {/* Destaques em Métricas */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-2xl">
              <Star className="w-5 h-5 fill-amber-500" />
              <span>4.9 / 5.0</span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              +300 avaliações verificadas
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-bold text-2xl">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Zero Atrasos</span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              Horários pontuais e dedicados
            </span>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-center">
            <div className="flex items-center gap-1 text-neutral-900 dark:text-white font-bold text-2xl">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>100% Online</span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              Confirmação e lembrete instantâneo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
