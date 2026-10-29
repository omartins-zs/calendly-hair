"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Calendar, Clock, User, Scissors, AlertCircle } from "lucide-react";
import { Service, Professional, Booking } from "../types";
import {
  formatCurrency,
  formatDateBr,
  calculateEndTime,
  validateBookingInput,
  generateBookingCode,
} from "../lib/bookingEngine";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  professional: Professional;
  date: string;
  time: string;
  onBookingConfirmed: (booking: Booking) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  service,
  professional,
  date,
  time,
  onBookingConfirmed,
}: BookingModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const endTime = calculateEndTime(time, service.durationMinutes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateBookingInput({
      serviceId: service.id,
      professionalId: professional.id,
      date,
      startTime: time,
      clientName,
      clientEmail,
      clientPhone,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const newBooking: Booking = {
      id: generateBookingCode(),
      serviceId: service.id,
      serviceName: service.name,
      professionalId: professional.id,
      professionalName: professional.name,
      date,
      startTime: time,
      endTime,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      notes: notes.trim() || undefined,
      price: service.price,
      status: "confirmado",
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setNotes("");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Botão Fechar */}
        <button
          onClick={handleResetAndClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Tela de Sucesso / Recibo */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Agendamento Confirmado
              </span>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                Tudo pronto para seu atendimento!
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Código da Reserva: <strong className="text-neutral-900 dark:text-white font-mono">{confirmedBooking.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Serviço:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Profissional:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{confirmedBooking.professionalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Data & Horário:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formatDateBr(confirmedBooking.date)} às {confirmedBooking.startTime} ({service.durationMinutes} min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Cliente:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{confirmedBooking.clientName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 font-medium">Valor Total:</span>
                <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
                  {formatCurrency(confirmedBooking.price)}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/20"
            >
              Concluir & Voltar ao Início
            </button>
          </div>
        ) : (
          /* Formulário de Confirmação */
          <div>
            <div className="mb-5">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Finalizar Agendamento
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Revise os detalhes e informe seus dados para a reserva do horário.
              </p>
            </div>

            {/* Resumo Rápido */}
            <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 mb-6 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-400">Serviço</span>
                <p className="font-bold text-neutral-900 dark:text-white truncate">{service.name}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-400">Profissional</span>
                <p className="font-bold text-neutral-900 dark:text-white truncate">{professional.name}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-400">Data</span>
                <p className="font-bold text-neutral-900 dark:text-white">{formatDateBr(date)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-400">Horário & Duração</span>
                <p className="font-bold text-neutral-900 dark:text-white">{time} às {endTime} ({service.durationMinutes} min)</p>
              </div>
            </div>

            {/* Formulário */}
            <form data-testid="booking-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 transition-all ${
                    errors.clientName
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-neutral-200 dark:border-neutral-800 focus:border-amber-500 focus:ring-amber-500/20"
                  }`}
                />
                {errors.clientName && (
                  <span className="text-[11px] text-red-500 mt-1 block">{errors.clientName}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    placeholder="carlos@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 transition-all ${
                      errors.clientEmail
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-neutral-200 dark:border-neutral-800 focus:border-amber-500 focus:ring-amber-500/20"
                    }`}
                  />
                  {errors.clientEmail && (
                    <span className="text-[11px] text-red-500 mt-1 block">{errors.clientEmail}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 transition-all ${
                      errors.clientPhone
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-neutral-200 dark:border-neutral-800 focus:border-amber-500 focus:ring-amber-500/20"
                    }`}
                  />
                  {errors.clientPhone && (
                    <span className="text-[11px] text-red-500 mt-1 block">{errors.clientPhone}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Observações (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Cabelo com pomada, preferência por máquina 1 nas laterais..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <span>Confirmar Agendamento • {formatCurrency(service.price)}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
