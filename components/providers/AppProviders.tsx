"use client";

import { ImageModalProvider } from "@/contexts/imageModal";
import ImageModal from "@/components/ui/ImageModal";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ImageModalProvider>
        {children}
        <ImageModal />
        <WhatsAppFloat />
      </ImageModalProvider>
    </ThemeProvider>
  );
}
