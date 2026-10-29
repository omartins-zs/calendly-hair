"use client";

import React, { useState } from "react";
import { X, Lock, Mail, Shield, User, Scissors } from "lucide-react";
import { AuthUser, UserRole } from "../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("admin@calendlyhair.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const demoAccounts = [
    {
      role: "admin" as UserRole,
      label: "Administrador",
      email: "admin@calendlyhair.local",
      pass: "admin123",
      icon: <Shield className="w-4 h-4 text-amber-500" />,
    },
    {
      role: "professional" as UserRole,
      label: "Profissional",
      email: "profissional@calendlyhair.local",
      pass: "pro123",
      icon: <Scissors className="w-4 h-4 text-blue-500" />,
    },
    {
      role: "client" as UserRole,
      label: "Cliente",
      email: "cliente@calendlyhair.local",
      pass: "cliente123",
      icon: <User className="w-4 h-4 text-emerald-500" />,
    },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@calendlyhair.local" && password === "admin123") {
      onLoginSuccess({
        id: "usr-admin",
        name: "Administrador do Salão",
        email,
        role: "admin",
      });
      onClose();
      return;
    }

    if (email === "profissional@calendlyhair.local" && password === "pro123") {
      onLoginSuccess({
        id: "usr-pro",
        name: "Gabriel Martins (Barbeiro)",
        email,
        role: "professional",
      });
      onClose();
      return;
    }

    if (email === "cliente@calendlyhair.local" && password === "cliente123") {
      onLoginSuccess({
        id: "usr-client",
        name: "Lucas Rocha",
        email,
        role: "client",
      });
      onClose();
      return;
    }

    setError("Credenciais inválidas. Use um dos perfis de demonstração abaixo.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Acesso ao Sistema
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Entre com suas credenciais ou selecione um perfil de teste rápido.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/20"
          >
            Entrar no Painel
          </button>
        </form>

        {/* Perfis de Teste com 1 clique */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2.5">
            Preenchimento Rápido (Ambiente de Teste):
          </span>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 hover:border-amber-500 text-left transition-colors flex flex-col items-center text-center"
              >
                {acc.icon}
                <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 mt-1">
                  {acc.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
