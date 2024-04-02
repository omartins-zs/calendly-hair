"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const t = useTranslations("Index");

  return (
    <div className="text-emerald-500 font-bold flex flex-col gap-3 text-center">
      <ModeToggle />
      <h3>{t("title")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button className="hover:scale-105">{t("signUp")}</Button>
        <Button
          className="hover:bg-purple-500 text-black px-5"
          variant="destructive"
        >
          {t("signIn")}
        </Button>
      </div>
    </div>
  );
}
