"use client";

import { useTheme } from "@/lib/theme";
import { Toaster } from "sonner";

/** Sonner toaster that follows the app's light/dark mode. */
export function ThemedToaster() {
  const { mode } = useTheme();
  return (
    <Toaster
      theme={mode}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "12px",
          fontSize: "13px",
        },
      }}
    />
  );
}
