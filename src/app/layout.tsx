import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: { default: "Vijay Copier Solutions – Premium Xerox Machines", template: "%s | Vijay Copier Solutions" },
  description: "India's most trusted destination for premium Xerox & copier machines. Buy, rent, and service high-quality copying solutions for offices, schools, and businesses.",
  keywords: ["xerox machines", "copier solutions", "office printers", "Vijay Copier", "buy xerox machine", "xerox dealer India"],
  authors: [{ name: "Vijay Copier Solutions" }],
  creator: "Vijay Copier Solutions",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Vijay Copier Solutions",
    title: "Vijay Copier Solutions – Premium Xerox Machines",
    description: "India's most trusted destination for premium Xerox & copier machines.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050b18",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#0f1e35",
                color: "#f0f6ff",
                border: "1px solid rgba(14,165,233,0.2)",
                borderRadius: "12px",
                fontSize: "0.875rem",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "#f0f6ff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#f0f6ff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
