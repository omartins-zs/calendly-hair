import { describe, it, expect } from "vitest";
import {
  timeToMinutes,
  minutesToTime,
  calculateEndTime,
  isTimeOverlapping,
  generateTimeSlots,
  validateBookingInput,
  formatCurrency,
  formatDateBr,
  generateBookingCode,
} from "../src/lib/bookingEngine";
import { INITIAL_PROFESSIONALS, INITIAL_SERVICES } from "../src/data/initialData";
import { Booking } from "../src/types";

describe("bookingEngine - Conversões e Cálculos de Tempo", () => {
  it("converte horário HH:mm em minutos corretamente", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("01:30")).toBe(90);
    expect(timeToMinutes("09:45")).toBe(585);
    expect(timeToMinutes("23:59")).toBe(1439);
  });

  it("trata horários inválidos ou vazios no timeToMinutes retornando 0", () => {
    expect(timeToMinutes("")).toBe(0);
    expect(timeToMinutes("invalido")).toBe(0);
    expect(timeToMinutes(":")).toBe(0);
  });

  it("converte minutos em string HH:mm com padding correto", () => {
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(90)).toBe("01:30");
    expect(minutesToTime(585)).toBe("09:45");
    expect(minutesToTime(-10)).toBe("00:00"); // Proteção contra valores negativos
  });

  it("calcula o horário de término somando a duração", () => {
    expect(calculateEndTime("09:00", 45)).toBe("09:45");
    expect(calculateEndTime("10:30", 60)).toBe("11:30");
    expect(calculateEndTime("23:30", 45)).toBe("00:15");
    expect(calculateEndTime("10:00", -15)).toBe("10:00");
  });

  it("detecta sobreposição de horários corretamente", () => {
    // Sobreposição total / contido
    expect(isTimeOverlapping("09:00", "10:00", "09:15", "09:45")).toBe(true);

    // Sobreposição cruzada
    expect(isTimeOverlapping("09:00", "10:00", "09:30", "10:30")).toBe(true);
    expect(isTimeOverlapping("09:30", "10:30", "09:00", "10:00")).toBe(true);

    // Adjacentes exatos (não sobrepõem)
    expect(isTimeOverlapping("09:00", "10:00", "10:00", "11:00")).toBe(false);
    expect(isTimeOverlapping("10:00", "11:00", "09:00", "10:00")).toBe(false);

    // Completamente separados
    expect(isTimeOverlapping("09:00", "09:30", "14:00", "15:00")).toBe(false);
  });
});

describe("bookingEngine - Geração de Slots de Horários", () => {
  const pro = INITIAL_PROFESSIONALS[0]; // Gabriel Martins: 09:00 às 19:00, almoço 12:00 às 13:00, Seg-Sáb

  it("gera lista de horários respeitando expediente", () => {
    // Terça-feira (2026-11-03)
    const slots = generateTimeSlots({
      date: "2026-11-03",
      professional: pro,
      serviceDuration: 45,
      slotInterval: 30,
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].time).toBe("09:00");
    expect(slots[0].available).toBe(true);
  });

  it("bloqueia horários que coincidem com o intervalo de almoço", () => {
    const slots = generateTimeSlots({
      date: "2026-11-03",
      professional: pro,
      serviceDuration: 45,
      slotInterval: 30,
    });

    // Slot das 12:00 até 12:45 cai no almoço (12:00 às 13:00)
    const lunchSlot = slots.find((s) => s.time === "12:00");
    expect(lunchSlot).toBeDefined();
    expect(lunchSlot?.available).toBe(false);
    expect(lunchSlot?.reason).toBe("Horário de intervalo / almoço");
  });

  it("bloqueia horários que coincidem com agendamentos existentes", () => {
    const existing: Booking[] = [
      {
        id: "BK-999",
        serviceId: "serv-1",
        serviceName: "Corte",
        professionalId: pro.id,
        professionalName: pro.name,
        date: "2026-11-03",
        startTime: "10:00",
        endTime: "10:45",
        clientName: "Teste",
        clientEmail: "teste@teste.com",
        clientPhone: "11999999999",
        price: 60,
        status: "confirmado",
        createdAt: "2026-10-29",
      },
    ];

    const slots = generateTimeSlots({
      date: "2026-11-03",
      professional: pro,
      serviceDuration: 45,
      existingBookings: existing,
      slotInterval: 30,
    });

    const bookedSlot = slots.find((s) => s.time === "10:00");
    expect(bookedSlot?.available).toBe(false);
    expect(bookedSlot?.reason).toBe("Horário já reservado");
  });

  it("ignora agendamentos cancelados no cálculo de disponibilidade", () => {
    const existing: Booking[] = [
      {
        id: "BK-CANCELADO",
        serviceId: "serv-1",
        serviceName: "Corte",
        professionalId: pro.id,
        professionalName: pro.name,
        date: "2026-11-03",
        startTime: "14:00",
        endTime: "14:45",
        clientName: "Teste Cancelado",
        clientEmail: "teste@teste.com",
        clientPhone: "11999999999",
        price: 60,
        status: "cancelado",
        createdAt: "2026-10-29",
      },
    ];

    const slots = generateTimeSlots({
      date: "2026-11-03",
      professional: pro,
      serviceDuration: 45,
      existingBookings: existing,
    });

    const slot14 = slots.find((s) => s.time === "14:00");
    expect(slot14?.available).toBe(true);
  });

  it("retorna lista vazia caso o profissional não atenda no dia da semana", () => {
    // Domingo (2026-11-01) - Gabriel não atende aos domingos (availableDays: [1,2,3,4,5,6])
    const slots = generateTimeSlots({
      date: "2026-11-01",
      professional: pro,
      serviceDuration: 45,
    });

    expect(slots).toEqual([]);
  });

  it("retorna lista vazia se data ou profissional forem inválidos", () => {
    expect(
      generateTimeSlots({
        date: "",
        professional: pro,
        serviceDuration: 30,
      })
    ).toEqual([]);

    expect(
      generateTimeSlots({
        date: "2026-11-03",
        professional: null as any,
        serviceDuration: 30,
      })
    ).toEqual([]);
  });
});

describe("bookingEngine - Validação de Dados de Agendamento", () => {
  it("valida com sucesso dados completos e corretos", () => {
    const res = validateBookingInput({
      serviceId: "serv-corte-degrade",
      professionalId: "pro-gabriel",
      date: "2099-12-31",
      startTime: "14:00",
      clientName: "Gabriel Martins",
      clientEmail: "gabriel@email.com",
      clientPhone: "(11) 98765-4321",
    });

    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it("identifica erros em todos os campos obrigatórios vazios", () => {
    const res = validateBookingInput({});

    expect(res.isValid).toBe(false);
    expect(res.errors.serviceId).toBeDefined();
    expect(res.errors.professionalId).toBeDefined();
    expect(res.errors.date).toBeDefined();
    expect(res.errors.startTime).toBeDefined();
    expect(res.errors.clientName).toBeDefined();
    expect(res.errors.clientEmail).toBeDefined();
    expect(res.errors.clientPhone).toBeDefined();
  });

  it("rejeita datas no passado", () => {
    const res = validateBookingInput({
      serviceId: "serv-1",
      professionalId: "pro-1",
      date: "2000-01-01",
      startTime: "10:00",
      clientName: "Cliente Teste",
      clientEmail: "cliente@teste.com",
      clientPhone: "11988887777",
    });

    expect(res.isValid).toBe(false);
    expect(res.errors.date).toBe("A data selecionada não pode ser anterior a hoje.");
  });

  it("rejeita e-mail inválido e telefone com poucos dígitos", () => {
    const res = validateBookingInput({
      serviceId: "serv-1",
      professionalId: "pro-1",
      date: "2099-12-31",
      startTime: "10:00",
      clientName: "Cliente Teste",
      clientEmail: "email_invalido_sem_arroba",
      clientPhone: "12345",
    });

    expect(res.isValid).toBe(false);
    expect(res.errors.clientEmail).toContain("e-mail válido");
    expect(res.errors.clientPhone).toContain("DDD válido");
  });
});

describe("bookingEngine - Formatação e Utilitários", () => {
  it("formata valores para moeda brasileira R$", () => {
    const formatted = formatCurrency(60.0);
    expect(formatted).toContain("60");
    expect(formatted).toMatch(/R\$/);
  });

  it("formata datas YYYY-MM-DD para DD/MM/YYYY", () => {
    expect(formatDateBr("2026-10-30")).toBe("30/10/2026");
    expect(formatDateBr("invalida")).toBe("invalida");
    expect(formatDateBr("")).toBe("");
  });

  it("gera código de agendamento no formato BK-XXXX", () => {
    const code = generateBookingCode();
    expect(code).toMatch(/^BK-\d{4}$/);
  });
});
