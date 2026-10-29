"use client";

import React from "react";
import { Scissors, Calendar, UserCheck, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AuthUser } from "../types";

interface HeaderProps {
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  currentView: "home" | "dashboard";
  onNavigate: (view: "home" | "dashboard") => void;
}

export function Header({
  currentUser,
  onOpenLogin,
  onLogout,
  currentView,
  onNavigate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate("home")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onNavigate("home");
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-neutral-900 dark:text-white">
              Calendly<span className="text-amber-500">Hair</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase">
              Agendamento Inteligente
            </span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={() => onNavigate("home")}
            className={`transition-colors hover:text-amber-500 ${
              currentView === "home" ? "text-amber-500 font-semibold" : ""
            }`}
          >
            Início & Serviços
          </button>
          <a
            href="#agendamento"
            onClick={() => onNavigate("home")}
            className="transition-colors hover:text-amber-500"
          >
            Agendar Horário
          </a>
          <button
            onClick={() => onNavigate("dashboard")}
            className={`flex items-center gap-1.5 transition-colors hover:text-amber-500 ${
              currentView === "dashboard" ? "text-amber-500 font-semibold" : ""
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Painel da Agenda
          </button>
        </nav>

        {/* Ações da Direita */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {currentUser ? (
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/60 p-1.5 pr-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 text-xs text-neutral-500 hover:text-red-500 transition-colors"
                title="Sair do perfil"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all shadow-amber-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Acessar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

