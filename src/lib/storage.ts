import { Booking, Professional, Service, AuthUser } from "../types";
import { INITIAL_BOOKINGS, INITIAL_PROFESSIONALS, INITIAL_SERVICES } from "../data/initialData";

const STORAGE_KEYS = {
  SERVICES: "calendly_hair_services",
  PROFESSIONALS: "calendly_hair_professionals",
  BOOKINGS: "calendly_hair_bookings",
  AUTH_USER: "calendly_hair_auth_user",
};

let memoryBookings: Booking[] = [...INITIAL_BOOKINGS];
let memoryServices: Service[] = [...INITIAL_SERVICES];
let memoryProfessionals: Professional[] = [...INITIAL_PROFESSIONALS];
let memoryAuthUser: AuthUser | null = null;

function isClient(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export const StorageManager = {
  getServices(): Service[] {
    if (isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return memoryServices.length > 0 ? memoryServices : [...INITIAL_SERVICES];
  },

  getProfessionals(): Professional[] {
    if (isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.PROFESSIONALS);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return memoryProfessionals.length > 0 ? memoryProfessionals : [...INITIAL_PROFESSIONALS];
  },

  getBookings(): Booking[] {
    if (isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return memoryBookings.length > 0 ? memoryBookings : [...INITIAL_BOOKINGS];
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

  getAuthUser(): AuthUser | null {
    if (isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          // fallback
        }
      }
    }
    return memoryAuthUser;
  },

  setAuthUser(user: AuthUser | null): void {
    if (isClient()) {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    }
    memoryAuthUser = user;
  },

  reset(): void {
    if (isClient()) {
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.PROFESSIONALS);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
    memoryBookings = [...INITIAL_BOOKINGS];
    memoryServices = [...INITIAL_SERVICES];
    memoryProfessionals = [...INITIAL_PROFESSIONALS];
    memoryAuthUser = null;
  },
};
