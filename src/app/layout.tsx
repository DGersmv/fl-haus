import "./globals.css";
import Header from "@/components/Header";
import { Montserrat_Alternates } from "next/font/google";
import { ViewModeProvider } from "@/components/ui/ViewMode";
import ModeSync from "@/components/ui/ModeSync";           // ← синхронизация режима по URL
import HtmlModeClass from "@/components/ui/HtmlModeClass"; // ← класс на <html> для глобальных стилей

const montserrat = Montserrat_Alternates({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "tashi-ani.ru",
  description: "Ландшафтная архитектура, портфолио и проекты",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <head>
        {/* Предзагрузка первого фона как плейсхолдера, чтобы не было «чёрного кадра» */}
        <link rel="preload" as="image" href="/portfolio/01.jpg" />
      </head>
      <body
        className="min-h-screen bg-black"
        style={{
          // статичный бэкграунд-плейсхолдер до старта слайдшоу
          backgroundImage: "url('/portfolio/01.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // Важно: без backgroundAttachment: 'fixed' — на ряде устройств даёт дёрганья
        }}
      >
        <ViewModeProvider>
          {/* синхронизация режима по маршруту + глобальный data-атрибут на <html> */}
          <ModeSync />
          <HtmlModeClass />

          {/* Header */}
          <Header />

          {/* контент страниц */}
          <div className="main-content">
            {children}
          </div>
        </ViewModeProvider>
      </body>
    </html>
  );
}
