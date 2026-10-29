"use client";

import React from "react";
import { Star, Check, Scissors } from "lucide-react";
import { Professional } from "../types";

interface ProfessionalCardProps {
  professional: Professional;
  isSelected: boolean;
  onSelect: (pro: Professional) => void;
}

export function ProfessionalCard({
  professional,
  isSelected,
  onSelect,
}: ProfessionalCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(professional)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(professional);
        }
      }}
      className={`group relative p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 focus:outline-none flex items-center gap-4 ${
        isSelected
          ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-amber-600 font-bold text-lg overflow-hidden">
          {professional.name.charAt(0)}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 flex items-center justify-center" title="Profissional disponível">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm text-neutral-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
            {professional.name}
          </h4>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-amber-500" />
            {professional.rating}
          </span>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
          {professional.role}
        </p>

        <p className="text-[11px] text-amber-600/90 dark:text-amber-400/90 font-medium truncate mt-1">
          {professional.specialty}
        </p>
      </div>

      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
          isSelected
            ? "bg-amber-500 border-amber-500 text-white"
            : "border-neutral-300 dark:border-neutral-700 bg-transparent"
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </div>
  );
}

