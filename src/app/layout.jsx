import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientProvider } from "@/app/utils/ClientProvider";
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Snakk - Your Hostel Snacks",
  description: "Your go-to destination for hostel snacks",
  icons: {
    icon: "/Main-Logo.svg",
    apple: "/Main-Logo.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} antialiased`}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
