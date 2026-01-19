import "./globals.css";
import Header from "@/components/Header";
import { Montserrat_Alternates } from "next/font/google";
import { ViewModeProvider } from "@/components/ui/ViewMode";
import ModeSync from "@/components/ui/ModeSync";           // <- sync mode by URL
import HtmlModeClass from "@/components/ui/HtmlModeClass"; // <- class on <html> for global styles

const montserrat = Montserrat_Alternates({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Country House",
  description: "Construction of country houses, landscape design, projects and portfolio",
  icons: {
    icon: "/logo_new.png",
    shortcut: "/logo_new.png",
    apple: "/logo_new.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <head>
        <link rel="preload" as="image" href="/portfolio/01.jpg" />
      </head>
      <body
        className="min-h-screen bg-black"
        style={{
          backgroundImage: "url('/portfolio/01.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <ViewModeProvider>
          <ModeSync />
          <HtmlModeClass />
          <Header />
          <div className="main-content">
            {children}
          </div>
        </ViewModeProvider>
      </body>
    </html>
  );
}
