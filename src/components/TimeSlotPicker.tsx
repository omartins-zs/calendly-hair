"use client";

import React, { useMemo, useRef } from "react";
import { Calendar as CalendarIcon, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Professional, Service, Booking } from "../types";
import { generateTimeSlots, formatDateBr } from "../lib/bookingEngine";

interface TimeSlotPickerProps {
  selectedService: Service;
  selectedProfessional: Professional;
  selectedDate: string;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  existingBookings: Booking[];
}

export function TimeSlotPicker({
  selectedService,
  selectedProfessional,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  existingBookings,
}: TimeSlotPickerProps) {
  const datesContainerRef = useRef<HTMLDivElement>(null);

  // Gera os próximos 14 dias úteis a partir de hoje
  const upcomingDays = useMemo(() => {
    const days: { dateStr: string; label: string; weekDay: string; available: boolean }[] = [];
    const now = new Date();

    const weekDaysNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const dayOfWeek = d.getDay();
      const isAvailableDay = selectedProfessional.availableDays.includes(dayOfWeek);

      days.push({
        dateStr,
        label: `${day}/${month}`,
        weekDay: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : weekDaysNames[dayOfWeek],
        available: isAvailableDay,
      });
    }

    return days;
  }, [selectedProfessional]);

  // Gera os slots do dia atual selecionado
  const timeSlots = useMemo(() => {
    return generateTimeSlots({
      date: selectedDate,
      professional: selectedProfessional,
      serviceDuration: selectedService.durationMinutes,
      existingBookings,
      slotInterval: 30,
    });
  }, [selectedDate, selectedProfessional, selectedService, existingBookings]);

  const handleScrollDates = (direction: "left" | "right") => {
    if (datesContainerRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      datesContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Seleção de Data */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              1. Selecione a Data
            </h4>
          </div>

          {/* Controles de Navegação Horizontal */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScrollDates("left")}
              aria-label="Dias anteriores"
              className="p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollDates("right")}
              aria-label="Próximos dias"
              className="p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={datesContainerRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar scroll-smooth"
        >
          {upcomingDays.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                disabled={!day.available}
                onClick={() => {
                  onSelectDate(day.dateStr);
                }}
                className={`flex flex-col items-center justify-center min-w-[76px] py-3 px-2.5 rounded-2xl border transition-all text-center select-none ${
                  !day.available
                    ? "opacity-35 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-200 dark:border-neutral-800"
                    : isSelected
                    ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-[1.02]"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-200 hover:border-amber-500/50 hover:bg-amber-500/5"
                }`}
              >
                <span
                  className={`text-[11px] font-medium leading-none ${
                    isSelected ? "text-amber-100" : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {day.weekDay}
                </span>
                <span className="text-sm font-bold mt-1.5 leading-none">
                  {day.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Seleção de Horário */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              2. Horários para {formatDateBr(selectedDate)}
            </h4>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Duração: {selectedService.durationMinutes} min
          </span>
        </div>

        {timeSlots.length === 0 ? (
          <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-center">
            <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {selectedProfessional.name} não possui expediente neste dia.
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Por favor, selecione outra data acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  title={slot.reason || `Disponível (${slot.time} às ${slot.endTime})`}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center ${
                    !slot.available
                      ? "bg-neutral-100 dark:bg-neutral-900/40 text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-800/80 cursor-not-allowed line-through"
                      : isSelected
                      ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-[1.03]"
                      : "bg-white dark:bg-neutral-900/70 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer active:scale-95"
                  }`}
                >
                  <span>{slot.time}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
