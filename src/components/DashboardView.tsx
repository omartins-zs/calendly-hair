"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarCheck,
  DollarSign,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Shield,
  Scissors,
  User,
  PlusCircle,
  Lock,
  LogIn,
} from "lucide-react";
import { Booking, BookingStatus, AuthUser } from "../types";
import { formatCurrency, formatDateBr } from "../lib/bookingEngine";
import { scopeBookings, getBookingActions, roleLabel } from "../lib/access";

interface DashboardViewProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onBackToHome: () => void;
  currentUser?: AuthUser | null;
  onOpenLogin?: () => void;
  onGoToBooking?: () => void;
}

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
];

export function DashboardView({
  bookings,
  onUpdateStatus,
  onBackToHome,
  currentUser,
  onOpenLogin,
  onGoToBooking,
}: DashboardViewProps) {
  // Regra dos Hooks do React: TODOS os hooks são chamados incondicionalmente no topo.
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const isClient = currentUser?.role === "client";
  const isProfessional = currentUser?.role === "professional";
  const isAdmin = currentUser?.role === "admin";

  // Reservas que o usuário logado tem direito de ver (centralizado em access.ts).
  const scopedBookings = useMemo(
    () => scopeBookings(currentUser, bookings),
    [bookings, currentUser]
  );

  // Métricas calculadas sobre o escopo do usuário.
  const stats = useMemo(() => {
    const total = scopedBookings.length;
    const active = scopedBookings.filter(
      (b) => b.status === "pendente" || b.status === "confirmado"
    ).length;
    const completed = scopedBookings.filter((b) => b.status === "concluido").length;
    const revenue = scopedBookings
      .filter((b) => b.status !== "cancelado")
      .reduce((sum, b) => sum + b.price, 0);

    return { total, active, completed, revenue };
  }, [scopedBookings]);

  // Lista filtrada por busca e status.
  const filteredBookings = useMemo(() => {
    return scopedBookings.filter((b) => {
      const matchesSearch =
        b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "todos" || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [scopedBookings, searchTerm, statusFilter]);

  // Visitante (não autenticado): o painel é restrito — convida ao login.
  if (!currentUser) {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 text-center animate-in fade-in duration-300">
        <div className="p-8 sm:p-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Área Restrita
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Painel da Agenda & Atendimentos
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
              A agenda de atendimentos é restrita a <strong>clientes</strong>,{" "}
              <strong>profissionais</strong> e <strong>administradores</strong>.
              Faça login para continuar — ou volte e agende um horário sem precisar de conta.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenLogin?.()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Fazer Login</span>
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-amber-500 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Agendar sem login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmado":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            Confirmado
          </span>
        );
      case "concluido":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Concluído
          </span>
        );
      case "cancelado":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 space-y-8 animate-in fade-in duration-300">
      {/* Banner de Sessão Ativa */}
      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
            {isAdmin ? (
              <Shield className="w-5 h-5" />
            ) : isProfessional ? (
              <Scissors className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-bold text-sm text-neutral-900 dark:text-white">
              Sessão Ativa: {currentUser.name} (
              <span className="capitalize text-amber-600 dark:text-amber-400">
                {roleLabel(currentUser.role)}
              </span>
              )
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isAdmin &&
                "Acesso irrestrito a faturamento estimado, relatórios e gestão de toda a equipe."}
              {isProfessional &&
                "Visão focada na sua agenda: confirme, conclua ou cancele os seus atendimentos."}
              {isClient &&
                "Área pessoal exclusiva com o seu histórico e as suas reservas."}
            </p>
          </div>
        </div>

        {isClient && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => {
                if (onGoToBooking) onGoToBooking();
                else onBackToHome();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Agendamento</span>
            </button>
          </div>
        )}
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-amber-500 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Vitrine Pública</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Painel da Agenda & Atendimentos
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isClient
              ? "Acompanhe as suas reservas no salão."
              : isProfessional
              ? "Sua fila de atendimentos: confirmações, conclusões e cancelamentos."
              : "Gestão completa de agendamentos em tempo real para salões e barbearias."}
          </p>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-medium">
              {isClient ? "Total Investido" : "Faturamento Estimado"}
            </span>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {formatCurrency(stats.revenue)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-medium">
              {isClient ? "Minhas Reservas" : "Total de Reservas"}
            </span>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              {stats.total}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-medium">Ativos (Pendente / Confirmado)</span>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {stats.active}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-medium">Atendidos / Concluídos</span>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.completed}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Controles de Busca e Filtro */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isClient
                ? "Pesquisar minhas reservas ou serviços..."
                : "Pesquisar por cliente, código ou serviço..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st.value
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20"
                  : "bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Agendamentos */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Código / Cliente</th>
                <th className="py-3.5 px-4">Serviço & Barbeiro</th>
                <th className="py-3.5 px-4">Data & Horário</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    {isClient
                      ? "Você ainda não possui agendamentos com este filtro."
                      : "Nenhum agendamento encontrado para este filtro."}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const actions = getBookingActions(currentUser, b);
                  const hasActions =
                    actions.canConfirm || actions.canComplete || actions.canCancel;

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {b.id}
                        </div>
                        <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                          {b.clientName}
                        </div>
                        {!isClient && (
                          <div className="text-[11px] text-neutral-400">{b.clientPhone}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {b.serviceName}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Profissional: {b.professionalName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {formatDateBr(b.date)}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {b.startTime} às {b.endTime}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(b.price)}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        {hasActions ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {actions.canConfirm && (
                              <button
                                onClick={() => onUpdateStatus(b.id, "confirmado")}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Confirmar agendamento"
                              >
                                Confirmar
                              </button>
                            )}
                            {actions.canComplete && (
                              <button
                                onClick={() => onUpdateStatus(b.id, "concluido")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Marcar como atendido"
                              >
                                Concluir
                              </button>
                            )}
                            {actions.canCancel && (
                              <button
                                onClick={() => onUpdateStatus(b.id, "cancelado")}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Cancelar agendamento"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-300 dark:text-neutral-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
