import { Booking, Professional, Service } from "../types";
import { INITIAL_BOOKINGS, INITIAL_PROFESSIONALS, INITIAL_SERVICES } from "../data/initialData";

const STORAGE_KEYS = {
  SERVICES: "calendly_hair_services",
  PROFESSIONALS: "calendly_hair_professionals",
  BOOKINGS: "calendly_hair_bookings",
};

let memoryBookings: Booking[] = [...INITIAL_BOOKINGS];
let memoryServices: Service[] = [...INITIAL_SERVICES];
let memoryProfessionals: Professional[] = [...INITIAL_PROFESSIONALS];

function isClient(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export const StorageManager = {
  getServices(): Service[] {
    if (isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          // fallback
        }
      }
    }
    return memoryServices;
  },

  getProfessionals(): Professional[] {
    if (isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.PROFESSIONALS);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          // fallback
        }
      }
    }
    return memoryProfessionals;
  },

  getBookings(): Booking[] {
    if (isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          // fallback
        }
      }
    }
    return memoryBookings;
  },

  saveBooking(booking: Booking): Booking {
    const current = this.getBookings();
    const updated = [booking, ...current];
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    }
    memoryBookings = updated;
    return booking;
  },

  updateBookingStatus(id: string, status: Booking["status"]): boolean {
    const current = this.getBookings();
    const index = current.findIndex((b) => b.id === id);
    if (index === -1) return false;

    current[index] = { ...current[index], status };
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(current));
    }
    memoryBookings = current;
    return true;
  },

  reset(): void {
    if (isClient()) {
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.PROFESSIONALS);
    }
    memoryBookings = [...INITIAL_BOOKINGS];
    memoryServices = [...INITIAL_SERVICES];
    memoryProfessionals = [...INITIAL_PROFESSIONALS];
  },
};
