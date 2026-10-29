"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { ServiceCard } from "../components/ServiceCard";
import { ProfessionalCard } from "../components/ProfessionalCard";
import { TimeSlotPicker } from "../components/TimeSlotPicker";
import { BookingModal } from "../components/BookingModal";
import { DashboardView } from "../components/DashboardView";
import { LoginModal } from "../components/LoginModal";
import { StorageManager } from "../lib/storage";
import { INITIAL_SERVICES, INITIAL_PROFESSIONALS, INITIAL_BOOKINGS } from "../data/initialData";
import { Service, Professional, Booking, AuthUser, BookingStatus } from "../types";
import { Scissors, CalendarCheck, Sparkles, UserCheck, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [professionals, setProfessionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Seleções do fluxo de agendamento
  const [selectedService, setSelectedService] = useState<Service | null>(INITIAL_SERVICES[0]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(INITIAL_PROFESSIONALS[0]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Modais e navegação
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "dashboard">("home");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [highlightBooking, setHighlightBooking] = useState(false);

  useEffect(() => {
    // Carrega dados da persistência com fallback garantido
    const loadedServices = StorageManager.getServices();
    const loadedPros = StorageManager.getProfessionals();
    const loadedBookings = StorageManager.getBookings();
    const savedUser = StorageManager.getAuthUser();

    const validServices = loadedServices && loadedServices.length > 0 ? loadedServices : INITIAL_SERVICES;
    const validPros = loadedPros && loadedPros.length > 0 ? loadedPros : INITIAL_PROFESSIONALS;
    const validBookings = loadedBookings && loadedBookings.length > 0 ? loadedBookings : INITIAL_BOOKINGS;

    setServices(validServices);
    setProfessionals(validPros);
    setBookings(validBookings);

    setSelectedService((prev) => prev || validServices[0]);
    setSelectedProfessional((prev) => prev || validPros[0]);

    if (savedUser) {
      setCurrentUser(savedUser);
    }

    const todayStr = getTodayDate();
    setSelectedDate(todayStr);
  }, []);

  const handleGoToBooking = () => {
    const doScroll = () => {
      const el = document.getElementById("agendamento");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightBooking(true);
        setTimeout(() => setHighlightBooking(false), 2500);
      }
    };

    if (currentView !== "home") {
      setCurrentView("home");
      setTimeout(doScroll, 120);
    } else {
      doScroll();
    }
  };

  const handleConfirmNewBooking = (newBooking: Booking) => {
    const saved = StorageManager.saveBooking(newBooking);
    setBookings((prev) => [saved, ...prev]);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTime(null);
  };

  const handleUpdateBookingStatus = (id: string, status: BookingStatus) => {
    StorageManager.updateBookingStatus(id, status);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    StorageManager.setAuthUser(user);
    if (user.role === "admin" || user.role === "professional") {
      setCurrentView("dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    StorageManager.setAuthUser(null);
    setCurrentView("home");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        currentView={currentView}
        onNavigate={setCurrentView}
        onGoToBooking={handleGoToBooking}
      />

      {/* Banner de Boas-Vindas de Usuário Conectado */}
      {currentUser && currentView === "home" && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 py-2.5 px-4 text-xs animate-in fade-in">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-700 dark:text-neutral-300">
                Conectado como <strong className="text-neutral-900 dark:text-white">{currentUser.name}</strong> (
                <span className="capitalize">{currentUser.role}</span>).
                {currentUser.role === "client" &&
                  " Seus dados serão preenchidos automaticamente na confirmação do agendamento."}
                {currentUser.role === "professional" &&
                  " Você pode gerenciar seus atendimentos pelo painel da agenda."}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView("dashboard")}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                {currentUser.role === "client" ? "Ver Minhas Reservas" : "Acessar Painel da Agenda"}
              </button>
              <button
                onClick={handleGoToBooking}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Agendar Horário
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === "dashboard" ? (
        <main className="flex-1">
          <DashboardView
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onBackToHome={() => setCurrentView("home")}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onGoToBooking={handleGoToBooking}
          />
        </main>
      ) : (
        <main className="flex-1">
          <HeroSection onStartBooking={handleGoToBooking} />

          {/* Seção de Serviços */}
          <section id="servicos" className="py-12 max-w-6xl mx-auto px-4">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Menu de Procedimentos
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
                Escolha o Serviço Desejado
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Cortes modernos, barboterapia tradicional e cuidados especiais com padrão de excelência.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedService?.id === service.id}
                  onSelect={(s) => {
                    setSelectedService(s);
                    setSelectedTime(null);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Seção de Profissionais */}
          <section className="py-8 max-w-6xl mx-auto px-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Nossa Equipe de Especialistas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
                Selecione o Barbeiro / Estilista
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Profissionais experientes prontos para atender no seu estilo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {professionals.map((pro) => (
                <ProfessionalCard
                  key={pro.id}
                  professional={pro}
                  isSelected={selectedProfessional?.id === pro.id}
                  onSelect={(p) => {
                    setSelectedProfessional(p);
                    setSelectedTime(null);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Seção Calendly de Seleção de Horário */}
          <section
            id="agendamento"
            className="py-12 max-w-6xl mx-auto px-4 border-t border-neutral-200/80 dark:border-neutral-800/80 scroll-mt-24"
          >
            <div
              className={`p-6 sm:p-10 rounded-3xl border bg-white dark:bg-neutral-900/40 shadow-sm transition-all duration-500 ${
                highlightBooking
                  ? "ring-4 ring-amber-500/60 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.01]"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              {highlightBooking && (
                <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold animate-bounce">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Selecione a data e o horário para agendar seu atendimento:</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Etapa Final
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-0.5">
                    Escolha a Data & Horário
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Atendimento com{" "}
                    <strong className="text-neutral-900 dark:text-white">
                      {selectedProfessional?.name}
                    </strong>{" "}
                    para{" "}
                    <strong className="text-neutral-900 dark:text-white">
                      {selectedService?.name}
                    </strong>
                    .
                  </p>
                </div>

                {selectedTime && (
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Continuar com {selectedTime}</span>
                  </button>
                )}
              </div>

              {selectedService && selectedProfessional ? (
                <TimeSlotPicker
                  selectedService={selectedService}
                  selectedProfessional={selectedProfessional}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedTime(null);
                  }}
                  onSelectTime={(t) => {
                    setSelectedTime(t);
                    setIsBookingModalOpen(true);
                  }}
                  existingBookings={bookings}
                />
              ) : (
                <div className="text-center py-10 text-neutral-400">
                  Selecione um serviço e um profissional acima para ver os horários.
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* Modal de Agendamento */}
      {selectedService && selectedProfessional && selectedDate && selectedTime && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          service={selectedService}
          professional={selectedProfessional}
          date={selectedDate}
          time={selectedTime}
          onBookingConfirmed={handleConfirmNewBooking}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* Modal de Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Rodapé */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 py-8 text-center text-xs text-neutral-500 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-neutral-900 dark:text-white">
              Calendly<span className="text-amber-500">Hair</span>
            </span>
            <span>— Sistema Inteligente de Agendamento</span>
          </div>
          <div>
            Feito com ❤️ por <strong className="text-neutral-900 dark:text-white">Gabriel Martins</strong> 🚀
          </div>
        </div>
      </footer>
    </div>
  );
}
