import { AuthUser, Booking, BookingStatus, UserRole } from "../types";

/**
 * Controle de acesso centralizado do CalendlyHair.
 *
 * Toda a regra de "quem vê o quê" e "quem pode fazer o quê" vive aqui, para que
 * os componentes (Header, DashboardView, BookingModal, página) apenas consumam
 * essas funções em vez de reimplementar a lógica de papéis cada um a seu modo.
 *
 * Regras de negócio:
 *  - Visitante (não logado): só agenda. Não acessa o painel.
 *  - Cliente: vê apenas as próprias reservas e pode cancelá-las; pode agendar.
 *  - Profissional: vê apenas a própria agenda; confirma, conclui e cancela.
 *  - Administrador: vê tudo e gerencia qualquer reserva.
 */

export interface DemoAccount {
  user: AuthUser;
  password: string;
  /** Rótulo curto exibido nos atalhos de login de demonstração. */
  label: string;
}

/**
 * Diretório único de contas de demonstração. É a fonte de verdade tanto para a
 * autenticação quanto para os atalhos de preenchimento rápido do login.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Administrador",
    password: "admin123",
    user: {
      id: "usr-admin",
      name: "Administrador do Salão",
      email: "admin@calendlyhair.local",
      role: "admin",
    },
  },
  {
    label: "Gabriel (Profissional)",
    password: "pro123",
    user: {
      id: "usr-pro-gabriel",
      name: "Gabriel Martins",
      email: "gabriel@calendlyhair.local",
      role: "professional",
      professionalId: "pro-gabriel",
    },
  },
  {
    label: "Thiago (Profissional)",
    password: "pro123",
    user: {
      id: "usr-pro-thiago",
      name: "Thiago Silva",
      email: "thiago@calendlyhair.local",
      role: "professional",
      professionalId: "pro-thiago",
    },
  },
  {
    label: "Lucas (Profissional)",
    password: "pro123",
    user: {
      id: "usr-pro-lucas",
      name: "Lucas Costa",
      email: "lucas@calendlyhair.local",
      role: "professional",
      professionalId: "pro-lucas",
    },
  },
  {
    label: "Cliente",
    password: "cliente123",
    user: {
      id: "usr-client",
      name: "Lucas Rocha",
      email: "cliente@calendlyhair.local",
      role: "client",
      phone: "(11) 99887-7665",
    },
  },
];

/**
 * Autentica por e-mail + senha contra o diretório de demonstração.
 * Retorna uma cópia do usuário (sem a senha) ou null se as credenciais falharem.
 */
export function authenticate(email: string, password: string): AuthUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (acc) => acc.user.email.toLowerCase() === normalizedEmail && acc.password === password
  );
  return account ? { ...account.user } : null;
}

/** Rótulo amigável para cada papel. */
export function roleLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Administrador";
    case "professional":
      return "Profissional";
    case "client":
      return "Cliente";
    default:
      return role;
  }
}

/** Apenas usuários autenticados têm acesso ao painel. */
export function canAccessDashboard(user: AuthUser | null | undefined): boolean {
  return !!user;
}

/** Visitantes e clientes podem criar novas reservas pela vitrine pública. */
export function canCreateBooking(user: AuthUser | null | undefined): boolean {
  return !user || user.role === "client";
}

/**
 * Restringe a lista de reservas ao que o usuário tem direito de ver.
 *  - admin: todas.
 *  - profissional: somente as vinculadas ao seu professionalId.
 *  - cliente: somente as vinculadas ao seu e-mail.
 *  - visitante: nenhuma.
 */
export function scopeBookings(
  user: AuthUser | null | undefined,
  bookings: Booking[]
): Booking[] {
  if (!user) return [];

  if (user.role === "admin") return bookings;

  if (user.role === "professional") {
    return bookings.filter((b) => b.professionalId === user.professionalId);
  }

  // Cliente: vínculo estrito pelo e-mail usado na reserva.
  const email = user.email.toLowerCase();
  return bookings.filter((b) => b.clientEmail.toLowerCase() === email);
}

export interface BookingActions {
  /** Aprovar uma reserva pendente (pendente -> confirmado). */
  canConfirm: boolean;
  /** Marcar como atendida (confirmado -> concluido). */
  canComplete: boolean;
  /** Cancelar a reserva. */
  canCancel: boolean;
}

const NO_ACTIONS: BookingActions = {
  canConfirm: false,
  canComplete: false,
  canCancel: false,
};

/**
 * Define quais ações o usuário pode executar sobre uma reserva específica,
 * considerando o papel e o status atual. Assume que `booking` já pertence ao
 * escopo do usuário (ver scopeBookings).
 */
export function getBookingActions(
  user: AuthUser | null | undefined,
  booking: Booking
): BookingActions {
  if (!user) return NO_ACTIONS;

  const isStaff = user.role === "admin" || user.role === "professional";
  const isClient = user.role === "client";

  if (isStaff) {
    return {
      canConfirm: booking.status === "pendente",
      canComplete: booking.status === "confirmado",
      canCancel: booking.status === "pendente" || booking.status === "confirmado",
    };
  }

  if (isClient) {
    // Cliente só pode cancelar as próprias reservas ainda ativas.
    return {
      ...NO_ACTIONS,
      canCancel: booking.status === "pendente" || booking.status === "confirmado",
    };
  }

  return NO_ACTIONS;
}

/** Status inicial de uma reserva recém-criada pelo cliente/visitante. */
export const INITIAL_BOOKING_STATUS: BookingStatus = "pendente";
