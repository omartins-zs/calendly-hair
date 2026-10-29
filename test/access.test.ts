import { describe, it, expect } from "vitest";
import {
  DEMO_ACCOUNTS,
  authenticate,
  roleLabel,
  canAccessDashboard,
  canCreateBooking,
  scopeBookings,
  getBookingActions,
  INITIAL_BOOKING_STATUS,
} from "../src/lib/access";
import { INITIAL_BOOKINGS } from "../src/data/initialData";
import { AuthUser, Booking, UserRole } from "../src/types";

const admin: AuthUser = {
  id: "usr-admin",
  name: "Admin",
  email: "admin@calendlyhair.local",
  role: "admin",
};
const proGabriel: AuthUser = {
  id: "usr-pro-gabriel",
  name: "Gabriel",
  email: "gabriel@calendlyhair.local",
  role: "professional",
  professionalId: "pro-gabriel",
};
const client: AuthUser = {
  id: "usr-client",
  name: "Lucas Rocha",
  email: "cliente@calendlyhair.local",
  role: "client",
};

function bookingWith(status: Booking["status"]): Booking {
  return {
    id: "BK-TEST",
    serviceId: "s",
    serviceName: "Serviço",
    professionalId: "pro-gabriel",
    professionalName: "Gabriel",
    date: "2026-11-10",
    startTime: "10:00",
    endTime: "10:30",
    clientName: "Cliente",
    clientEmail: "cliente@calendlyhair.local",
    clientPhone: "11999999999",
    price: 50,
    status,
    createdAt: "2026-10-29",
  };
}

describe("access - authenticate", () => {
  it("autentica contas válidas do diretório demo", () => {
    for (const acc of DEMO_ACCOUNTS) {
      const user = authenticate(acc.user.email, acc.password);
      expect(user).not.toBeNull();
      expect(user?.role).toBe(acc.user.role);
    }
  });

  it("ignora caixa e espaços no e-mail", () => {
    const user = authenticate("  ADMIN@calendlyhair.local  ", "admin123");
    expect(user?.role).toBe("admin");
  });

  it("rejeita e-mail inexistente ou senha incorreta", () => {
    expect(authenticate("naoexiste@x.com", "x")).toBeNull();
    expect(authenticate("admin@calendlyhair.local", "senhaerrada")).toBeNull();
  });
});

describe("access - roleLabel", () => {
  it("rotula cada papel conhecido", () => {
    expect(roleLabel("admin")).toBe("Administrador");
    expect(roleLabel("professional")).toBe("Profissional");
    expect(roleLabel("client")).toBe("Cliente");
  });

  it("devolve o próprio valor para papel desconhecido", () => {
    expect(roleLabel("outro" as UserRole)).toBe("outro");
  });
});

describe("access - gates de acesso", () => {
  it("canAccessDashboard exige autenticação", () => {
    expect(canAccessDashboard(null)).toBe(false);
    expect(canAccessDashboard(undefined)).toBe(false);
    expect(canAccessDashboard(admin)).toBe(true);
  });

  it("canCreateBooking libera visitante e cliente, bloqueia staff", () => {
    expect(canCreateBooking(null)).toBe(true);
    expect(canCreateBooking(client)).toBe(true);
    expect(canCreateBooking(admin)).toBe(false);
    expect(canCreateBooking(proGabriel)).toBe(false);
  });
});

describe("access - scopeBookings", () => {
  it("visitante não vê nada", () => {
    expect(scopeBookings(null, INITIAL_BOOKINGS)).toEqual([]);
  });

  it("admin vê todas as reservas", () => {
    expect(scopeBookings(admin, INITIAL_BOOKINGS)).toHaveLength(INITIAL_BOOKINGS.length);
  });

  it("profissional vê apenas as do seu professionalId", () => {
    const scoped = scopeBookings(proGabriel, INITIAL_BOOKINGS);
    expect(scoped.length).toBeGreaterThan(0);
    expect(scoped.every((b) => b.professionalId === "pro-gabriel")).toBe(true);
  });

  it("cliente vê apenas as vinculadas ao seu e-mail", () => {
    const scoped = scopeBookings(client, INITIAL_BOOKINGS);
    expect(scoped.every((b) => b.clientEmail === "cliente@calendlyhair.local")).toBe(true);
  });
});

describe("access - getBookingActions", () => {
  it("visitante não tem ações", () => {
    expect(getBookingActions(null, bookingWith("pendente"))).toEqual({
      canConfirm: false,
      canComplete: false,
      canCancel: false,
    });
  });

  it("staff confirma pendente, conclui confirmado e cancela ambos", () => {
    for (const staff of [admin, proGabriel]) {
      expect(getBookingActions(staff, bookingWith("pendente"))).toEqual({
        canConfirm: true,
        canComplete: false,
        canCancel: true,
      });
      expect(getBookingActions(staff, bookingWith("confirmado"))).toEqual({
        canConfirm: false,
        canComplete: true,
        canCancel: true,
      });
      expect(getBookingActions(staff, bookingWith("concluido"))).toEqual({
        canConfirm: false,
        canComplete: false,
        canCancel: false,
      });
      expect(getBookingActions(staff, bookingWith("cancelado"))).toEqual({
        canConfirm: false,
        canComplete: false,
        canCancel: false,
      });
    }
  });

  it("cliente só cancela reservas ativas", () => {
    expect(getBookingActions(client, bookingWith("pendente")).canCancel).toBe(true);
    expect(getBookingActions(client, bookingWith("confirmado")).canCancel).toBe(true);
    expect(getBookingActions(client, bookingWith("concluido")).canCancel).toBe(false);
    const actions = getBookingActions(client, bookingWith("pendente"));
    expect(actions.canConfirm).toBe(false);
    expect(actions.canComplete).toBe(false);
  });

  it("papel desconhecido não recebe ações", () => {
    const stranger = { ...client, role: "outro" as UserRole };
    expect(getBookingActions(stranger, bookingWith("pendente"))).toEqual({
      canConfirm: false,
      canComplete: false,
      canCancel: false,
    });
  });
});

describe("access - constantes", () => {
  it("nova reserva nasce pendente", () => {
    expect(INITIAL_BOOKING_STATUS).toBe("pendente");
  });
});
