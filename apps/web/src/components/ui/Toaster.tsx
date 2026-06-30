"use client";

import { Toaster as SonnerToaster } from "sonner";

/** App-wide toast host. Mounted once in the root layout. */
export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "rgba(20,19,32,0.95)",
          border: "1px solid rgba(200,162,76,0.35)",
          color: "#f6f1e7",
        },
      }}
    />
  );
}
