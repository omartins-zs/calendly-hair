import { describe, it, expect, beforeEach } from "vitest";
import { StorageManager } from "../src/lib/storage";
import { Booking } from "../src/types";

describe("StorageManager", () => {
  beforeEach(() => {
    StorageManager.reset();
    localStorage.clear();
  });

  it("retorna lista inicial de serviços e lê do localStorage se existir", () => {
    const services = StorageManager.getServices();
    expect(services.length).toBeGreaterThan(0);

    // Salva no localStorage e verifica se lê
    localStorage.setItem("calendly_hair_services", JSON.stringify(services));
    const fromStorage = StorageManager.getServices();
    expect(fromStorage.length).toBe(services.length);

    // Trata JSON corrompido com fallback
    localStorage.setItem("calendly_hair_services", "JSON_INVALIDO");
    const fallback = StorageManager.getServices();
    expect(fallback.length).toBeGreaterThan(0);
  });

  it("retorna lista inicial de profissionais e lê do localStorage se existir", () => {
    const pros = StorageManager.getProfessionals();
    expect(pros.length).toBeGreaterThan(0);

    localStorage.setItem("calendly_hair_professionals", JSON.stringify(pros));
    const fromStorage = StorageManager.getProfessionals();
    expect(fromStorage.length).toBe(pros.length);

    localStorage.setItem("calendly_hair_professionals", "JSON_INVALIDO");
    const fallback = StorageManager.getProfessionals();
    expect(fallback.length).toBeGreaterThan(0);
  });

  it("retorna lista de agendamentos e permite salvar um novo", () => {
    const initial = StorageManager.getBookings();
    const countBefore = initial.length;

    const newBooking: Booking = {
      id: "BK-TEST-1",
      serviceId: "serv-corte-degrade",
      serviceName: "Corte Degradê",
      professionalId: "pro-gabriel",
      professionalName: "Gabriel Martins",
      date: "2026-11-05",
      startTime: "11:00",
      endTime: "11:45",
      clientName: "Cliente Teste",
      clientEmail: "teste@email.com",
      clientPhone: "11988887777",
      price: 60.0,
      status: "confirmado",
      createdAt: new Date().toISOString(),
    };

    StorageManager.saveBooking(newBooking);

    const updated = StorageManager.getBookings();
    expect(updated.length).toBe(countBefore + 1);
    expect(updated[0].id).toBe("BK-TEST-1");

    // Testa fallback de agendamentos corrompidos
    localStorage.setItem("calendly_hair_bookings", "JSON_INVALIDO");
    const fallback = StorageManager.getBookings();
    expect(fallback.length).toBeGreaterThan(0);
  });

  it("permite atualizar o status de um agendamento existente", () => {
    const bookings = StorageManager.getBookings();
    const target = bookings[0];

    const success = StorageManager.updateBookingStatus(target.id, "concluido");
    expect(success).toBe(true);

    const updated = StorageManager.getBookings();
    const found = updated.find((b) => b.id === target.id);
    expect(found?.status).toBe("concluido");
  });

  it("retorna false ao tentar atualizar status de agendamento inexistente", () => {
    const success = StorageManager.updateBookingStatus("ID-QUE-NAO-EXISTE", "cancelado");
    expect(success).toBe(false);
  });

  it("reseta para os dados originais ao chamar reset()", () => {
    const newBooking: Booking = {
      id: "BK-TEMP",
      serviceId: "s1",
      serviceName: "s",
      professionalId: "p1",
      professionalName: "p",
      date: "2026-11-05",
      startTime: "10:00",
      endTime: "10:30",
      clientName: "T",
      clientEmail: "t@t.com",
      clientPhone: "11999999999",
      price: 50,
      status: "pendente",
      createdAt: "now",
    };
    StorageManager.saveBooking(newBooking);
    expect(StorageManager.getBookings().some((b) => b.id === "BK-TEMP")).toBe(true);

    StorageManager.reset();
    expect(StorageManager.getBookings().some((b) => b.id === "BK-TEMP")).toBe(false);
  });

  it("persiste, lê e limpa o usuário autenticado", () => {
    expect(StorageManager.getAuthUser()).toBeNull();

    const user = {
      id: "usr-pro-gabriel",
      name: "Gabriel Martins",
      email: "gabriel@calendlyhair.local",
      role: "professional" as const,
      professionalId: "pro-gabriel",
    };
    StorageManager.setAuthUser(user);
    expect(StorageManager.getAuthUser()).toEqual(user);

    // JSON corrompido cai no fallback de memória sem lançar
    localStorage.setItem("calendly_hair_auth_user", "JSON_INVALIDO");
    expect(StorageManager.getAuthUser()).toEqual(user);

    StorageManager.setAuthUser(null);
    expect(StorageManager.getAuthUser()).toBeNull();
  });
});
