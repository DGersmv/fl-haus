import "./globals.css";
import Header from "@/components/Header";
import SuppressFastRefreshLogs from "@/components/SuppressFastRefreshLogs";
import { Montserrat_Alternates } from "next/font/google";
import { ViewModeProvider } from "@/components/ui/ViewMode";
import { LoginOpenProvider } from "@/components/ui/LoginOpen";
import ModeSync from "@/components/ui/ModeSync";
import HtmlModeClass from "@/components/ui/HtmlModeClass";

const montserrat = Montserrat_Alternates({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "FL-Haus",
  description: "Строительство загородных домов, ландшафтный дизайн, проекты и портфолио",
  icons: {
    icon: "/logo_new.jpg",
    shortcut: "/logo_new.jpg",
    apple: "/logo_new.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <head>
        <link rel="preload" as="image" href="/portfolio/Проектирование/01.jpg" />
      </head>
      <body
        className="min-h-screen bg-black"
        style={{
          backgroundImage: "url('/portfolio/Проектирование/01.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <ViewModeProvider>
          <LoginOpenProvider>
            <SuppressFastRefreshLogs />
            <ModeSync />
            <HtmlModeClass />
            <Header />
            <div className="main-content">
              {children}
            </div>
          </LoginOpenProvider>
        </ViewModeProvider>
      </body>
    </html>
  );
}
