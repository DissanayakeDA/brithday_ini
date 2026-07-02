import type { Metadata } from "next";
import { EVENT_NAME } from "@bday/shared";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: EVENT_NAME,
  description: `You're invited to ${EVENT_NAME} at Shangri-La Colombo- Spice Room on 18th July.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
