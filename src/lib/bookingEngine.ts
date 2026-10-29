import { Booking, Professional } from "../types";

/**
 * Converte string de horário "HH:mm" em total de minutos a partir de 00:00.
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(":")) {
    return 0;
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converte minutos a partir de 00:00 em string no formato "HH:mm".
 */
export function minutesToTime(minutes: number): string {
  const safeMinutes = Math.max(0, minutes) % (24 * 60);
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Calcula o horário de término somando a duração ao horário de início.
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMins = timeToMinutes(startTime);
  const endMins = startMins + Math.max(0, durationMinutes);
  return minutesToTime(endMins);
}

/**
 * Verifica se dois intervalos de horário se sobrepõem.
 */
export function isTimeOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);

  // Intervalo A acontece antes de B ou depois de B
  return Math.max(sA, sB) < Math.min(eA, eB);
}

export interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

export interface GenerateSlotsParams {
  date: string; // YYYY-MM-DD
  professional: Professional;
  serviceDuration: number;
  existingBookings?: Booking[];
  slotInterval?: number; // Padrão: 30 minutos
}

/**
 * Gera a grade de horários do dia para um determinado profissional e serviço,
 * validando expediente, intervalos de almoço e agendamentos já confirmados/pendentes.
 */
export function generateTimeSlots({
  date,
  professional,
  serviceDuration,
  existingBookings = [],
  slotInterval = 30,
}: GenerateSlotsParams): TimeSlot[] {
  const slots: TimeSlot[] = [];

  if (!date || !professional) {
    return slots;
  }

  // Verifica se o profissional atende no dia da semana da data solicitada
  const parsedDate = new Date(`${date}T12:00:00`);
  const dayOfWeek = parsedDate.getDay();

  if (!professional.availableDays.includes(dayOfWeek)) {
    return slots;
  }

  const workStart = timeToMinutes(professional.workingHours.start);
  const workEnd = timeToMinutes(professional.workingHours.end);

  const breakStart = professional.breakHours ? timeToMinutes(professional.breakHours.start) : null;
  const breakEnd = professional.breakHours ? timeToMinutes(professional.breakHours.end) : null;

  // Filtra agendamentos ativos deste profissional para a data
  const dayBookings = existingBookings.filter(
    (b) =>
      b.professionalId === professional.id &&
      b.date === date &&
      b.status !== "cancelado"
  );

  let currentMin = workStart;

  while (currentMin + serviceDuration <= workEnd) {
    const slotStart = minutesToTime(currentMin);
    const slotEnd = minutesToTime(currentMin + serviceDuration);

    let isAvailable = true;
    let reason: string | undefined;

    // 1. Checa intervalo de almoço
    if (breakStart !== null && breakEnd !== null) {
      if (
        isTimeOverlapping(
          slotStart,
          slotEnd,
          minutesToTime(breakStart),
          minutesToTime(breakEnd)
        )
      ) {
        isAvailable = false;
        reason = "Horário de intervalo / almoço";
      }
    }

    // 2. Checa conflito com agendamentos existentes
    if (isAvailable) {
      for (const booking of dayBookings) {
        if (isTimeOverlapping(slotStart, slotEnd, booking.startTime, booking.endTime)) {
          isAvailable = false;
          reason = "Horário já reservado";
          break;
        }
      }
    }

    slots.push({
      time: slotStart,
      endTime: slotEnd,
      available: isAvailable,
      reason,
    });

    currentMin += slotInterval;
  }

  return slots;
}

/**
 * Validação dos campos do formulário de agendamento.
 */
export function validateBookingInput(data: {
  serviceId?: string;
  professionalId?: string;
  date?: string;
  startTime?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.serviceId || data.serviceId.trim() === "") {
    errors.serviceId = "Selecione um serviço para continuar.";
  }

  if (!data.professionalId || data.professionalId.trim() === "") {
    errors.professionalId = "Selecione um profissional para o atendimento.";
  }

  if (!data.date || data.date.trim() === "") {
    errors.date = "Escolha uma data para o agendamento.";
  } else {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    if (data.date < todayStr) {
      errors.date = "A data selecionada não pode ser anterior a hoje.";
    }
  }

  if (!data.startTime || data.startTime.trim() === "") {
    errors.startTime = "Selecione um horário disponível.";
  }

  if (!data.clientName || data.clientName.trim().length < 3) {
    errors.clientName = "O nome completo deve conter pelo menos 3 caracteres.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.clientEmail || !emailRegex.test(data.clientEmail.trim())) {
    errors.clientEmail = "Insira um endereço de e-mail válido.";
  }

  const cleanPhone = (data.clientPhone || "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.clientPhone = "Informe um número de telefone com DDD válido (mínimo 10 dígitos).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formata um valor numérico para Moeda Brasileira (R$).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

/**
 * Formata string de data ISO "YYYY-MM-DD" para "DD/MM/YYYY".
 */
export function formatDateBr(dateStr: string): string {
  if (!dateStr || !dateStr.includes("-")) {
    return dateStr;
  }
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Gera um identificador único para recibo de agendamento (ex: "BK-4921").
 */
export function generateBookingCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BK-${randomNum}`;
}
