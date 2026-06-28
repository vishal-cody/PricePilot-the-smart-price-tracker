import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata = {
  title: "PricePilot - Watch Prices Without Guessing",
  description:
    "A personal product watchlist that remembers prices and nudges you when a deal gets better.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster richColors />
      </body>
    </html>
  );
}
