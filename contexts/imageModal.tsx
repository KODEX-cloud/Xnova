"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ModalData {
  src: string;
  title?: string;
  description?: string;
  price?: string;
  href?: string;
  whatsappText?: string;
}

interface ImageModalCtx {
  open: (data: ModalData) => void;
  close: () => void;
  data: ModalData | null;
}

const Ctx = createContext<ImageModalCtx>({ open: () => {}, close: () => {}, data: null });

export function useImageModal() {
  return useContext(Ctx);
}

export function ImageModalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ModalData | null>(null);

  const open = useCallback((d: ModalData) => setData(d), []);
  const close = useCallback(() => setData(null), []);

  return (
    <Ctx.Provider value={{ open, close, data }}>
      {children}
    </Ctx.Provider>
  );
}
