import { Service, Professional, Booking } from "../types";

export const INITIAL_SERVICES: Service[] = [
  {
    id: "serv-corte-degrade",
    name: "Corte Degradê / Fade Moderno",
    description: "Corte personalizado com acabamento navalhado, alinhamento facial e finalização com pomada matte.",
    durationMinutes: 45,
    price: 60.0,
    category: "cabelo",
    iconName: "Scissors",
  },
  {
    id: "serv-barba-terapia",
    name: "Barboterapia Completa",
    description: "Ritual completo com toalha quente, óleos essenciais, massagem facial e navalha tradicional.",
    durationMinutes: 35,
    price: 45.0,
    category: "barba",
    iconName: "Sparkles",
  },
  {
    id: "serv-combo-master",
    name: "Combo VIP (Cabelo + Barba)",
    description: "Experiência completa com corte de cabelo moderno, barba alinhada e hidratação rápida.",
    durationMinutes: 75,
    price: 95.0,
    category: "combo",
    iconName: "Crown",
  },
  {
    id: "serv-hidratacao",
    name: "Tratamento Capilar & Lavagem",
    description: "Nutrição profunda dos fios, esfoliação do couro cabeludo e secagem com modelagem.",
    durationMinutes: 30,
    price: 50.0,
    category: "tratamento",
    iconName: "Droplets",
  },
  {
    id: "serv-sobrancelha",
    name: "Design de Sobrancelha Masculina",
    description: "Alinhamento com pinça e navalha preservando o formato natural dos olhos.",
    durationMinutes: 15,
    price: 25.0,
    category: "cabelo",
    iconName: "Eye",
  },
];

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: "pro-gabriel",
    name: "Gabriel Martins",
    role: "Master Barber & Hair Stylist",
    specialty: "Degradê Europeu, Tesoura e Barboterapia",
    rating: 4.9,
    reviewsCount: 148,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    workingHours: {
      start: "09:00",
      end: "19:00",
    },
    breakHours: {
      start: "12:00",
      end: "13:00",
    },
    availableDays: [1, 2, 3, 4, 5, 6], // Segunda a Sábado
  },
  {
    id: "pro-thiago",
    name: "Thiago Silva",
    role: "Especialista em Barba & Visagismo",
    specialty: "Barba Desenhada, Pigmentação e Linhas Clássicas",
    rating: 4.8,
    reviewsCount: 112,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    workingHours: {
      start: "10:00",
      end: "20:00",
    },
    breakHours: {
      start: "13:00",
      end: "14:00",
    },
    availableDays: [2, 3, 4, 5, 6], // Terça a Sábado
  },
  {
    id: "pro-lucas",
    name: "Lucas Costa",
    role: "Barbeiro Moderno & Cortes Urbanos",
    specialty: "Freestyle, Cortes Clássicos e Platina dos Fios",
    rating: 4.9,
    reviewsCount: 89,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    workingHours: {
      start: "08:30",
      end: "18:00",
    },
    breakHours: {
      start: "12:30",
      end: "13:30",
    },
    availableDays: [1, 2, 3, 4, 5], // Segunda a Sexta
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-1001",
    serviceId: "serv-combo-master",
    serviceName: "Combo VIP (Cabelo + Barba)",
    professionalId: "pro-gabriel",
    professionalName: "Gabriel Martins",
    date: "2026-10-30",
    startTime: "10:00",
    endTime: "11:15",
    clientName: "Rodrigo Almeida",
    clientEmail: "rodrigo@email.com",
    clientPhone: "(11) 98765-4321",
    notes: "Preferência por navalha descartável",
    price: 95.0,
    status: "confirmado",
    createdAt: "2026-10-28T14:30:00.000Z",
  },
  {
    id: "BK-1002",
    serviceId: "serv-corte-degrade",
    serviceName: "Corte Degradê / Fade Moderno",
    professionalId: "pro-thiago",
    professionalName: "Thiago Silva",
    date: "2026-10-30",
    startTime: "14:00",
    endTime: "14:45",
    clientName: "Marcos Vinicius",
    clientEmail: "marcos@email.com",
    clientPhone: "(11) 91234-5678",
    price: 60.0,
    status: "confirmado",
    createdAt: "2026-10-28T16:00:00.000Z",
  },
];
