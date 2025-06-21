// pages/_app.tsx
import "@/styles/app.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { SessionProvider } from "next-auth/react"; // Importe o SessionProvider
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Renomeado para evitar conflito
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout/Layout";

// Extraia pageProps e a sessão das props do App
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    // Envolva tudo com o SessionProvider, passando a prop session
    <SessionProvider session={session}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner /> {/* Manteve o nome Sonner para o segundo Toaster */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}