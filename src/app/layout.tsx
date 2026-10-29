import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calendly Hair — Sistema Inteligente de Agendamento",
  description:
    "Plataforma moderna e responsiva para gestão e agendamento online de barbearias, salões de beleza e profissionais de estética.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-amber-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
