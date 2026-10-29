"use client";

import React from "react";
import { Scissors, Sparkles, Crown, Droplets, Eye, Clock, Check } from "lucide-react";
import { Service } from "../types";
import { formatCurrency } from "../lib/bookingEngine";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  const getIcon = () => {
    switch (service.iconName) {
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case "Crown":
        return <Crown className="w-5 h-5 text-amber-500" />;
      case "Droplets":
        return <Droplets className="w-5 h-5 text-amber-500" />;
      case "Eye":
        return <Eye className="w-5 h-5 text-amber-500" />;
      default:
        return <Scissors className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(service)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(service);
        }
      }}
      className={`group relative p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 focus:outline-none ${
        isSelected
          ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
            isSelected
              ? "bg-amber-500 border-amber-500 text-white"
              : "border-neutral-300 dark:border-neutral-700 bg-transparent"
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-base text-neutral-900 dark:text-white leading-snug group-hover:text-amber-500 transition-colors">
          {service.name}
        </h3>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {service.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{service.durationMinutes} min</span>
        </div>

        <span className="font-bold text-base text-neutral-900 dark:text-white">
          {formatCurrency(service.price)}
        </span>
      </div>
    </div>
  );
}

