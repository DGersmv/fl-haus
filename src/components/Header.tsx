"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import HeaderMenu from "./HeaderMenu";

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onAuthUpdate?: () => void;
}

export default function Header({ isLoggedIn, isAdmin, onAuthUpdate }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 650);
      setIsTablet(width > 650 && width <= 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Логотип и кнопка: пропорции 21/9 как у панели с глобусом
  const height = 48;
  const width = Math.round(height * (21 / 9)); // 112
  const radius = 12;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "transparent",
        padding: isMobile ? "12px 24px" : "16px 32px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "space-between",
        minHeight: isMobile ? "100px" : "72px",
        gap: isMobile ? "8px" : "0",
      }}
    >
      {/* Логотип: ссылка на fl-haus.ru, без окаймления */}
      <a
        href="https://fl-haus.ru/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width,
          height,
          borderRadius: radius,
          overflow: "hidden",
          cursor: "pointer",
          textDecoration: "none",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
        }}
      >
        <Image
          src="/logo_fl.jpg"
          alt="FL-Haus — модульные дома"
          width={width}
          height={height}
          style={{
            borderRadius: radius,
            objectFit: "cover",
          }}
          priority
        />
      </a>

      {/* Меню */}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: "center",
          width: isMobile ? "100%" : "auto",
          minWidth: 0, // Позволяет сжиматься
        }}
      >
        <HeaderMenu 
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onAuthUpdate={onAuthUpdate}
        />
      </div>
    </header>
  );
}
