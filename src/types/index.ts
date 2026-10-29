export type ServiceCategory = "cabelo" | "barba" | "combo" | "tratamento";

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: ServiceCategory;
  iconName?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  avatarUrl: string;
  workingHours: {
    start: string; // Ex: "09:00"
    end: string;   // Ex: "19:00"
  };
  breakHours?: {
    start: string; // Ex: "12:00"
    end: string;   // Ex: "13:00"
  };
  availableDays: number[]; // 0 = Domingo, 1 = Segunda, etc.
}

export type BookingStatus = "pendente" | "confirmado" | "concluido" | "cancelado";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  price: number;
  status: BookingStatus;
  createdAt: string;
}

export type UserRole = "admin" | "professional" | "client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

