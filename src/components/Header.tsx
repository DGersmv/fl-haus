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

  // Размеры логотипа
  const logoSize = isMobile ? 60 : isTablet ? 70 : 80;
  const logoRadius = logoSize / 2;
  const innerPadding = logoRadius * 0.05;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "transparent",
        padding: isMobile ? "8px 16px" : "16px 24px",
        display: isMobile ? "flex" : "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "center" : "center",
        justifyContent: isMobile ? "center" : "space-between",
        minHeight: isMobile ? "120px" : isTablet ? "90px" : "100px",
        gap: isMobile ? "8px" : "0",
      }}
    >
      {/* Логотип */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: logoSize,
          height: logoSize,
          borderRadius: "50%",
          background: "rgba(206,214,177,0.18)",
          backdropFilter: "blur(18px)",
          border: "2px solid rgba(211,163,115,0.6)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.55)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.22), 0 0 12px rgba(64, 130, 109, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(211,163,115,0.6)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        }}
      >
        <Image
          src="/logo_new.jpg"
          alt="FL-Haus"
          width={logoSize * 0.9}
          height={logoSize * 0.9}
          style={{
            borderRadius: "50%",
            padding: innerPadding,
            transition: "transform 0.3s ease",
          }}
          priority
        />
      </div>

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
