"use client";
import React, { useEffect, useState } from "react";
import { useViewMode } from "@/components/ui/ViewMode";
import LoginPanel from "@/components/LoginPanel";

interface HeaderMenuProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onAuthUpdate?: () => void;
}

export default function HeaderMenu({ isLoggedIn: propIsLoggedIn, isAdmin: propIsAdmin, onAuthUpdate }: HeaderMenuProps = {}) {
  const [open, setOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn || false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(propIsAdmin || false);
  const { setMode, mode } = useViewMode();

  const loadUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      if (result.success && result.user?.name) {
        setUserName(result.user.name);
      }
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
    }
  };

  const syncAuthFromStorage = () => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const adminToken = localStorage.getItem('adminToken');
    const adminFlag = localStorage.getItem('isAdmin');

    if (savedEmail && savedLoginStatus === 'true') {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
      loadUserProfile(savedEmail);
    } else {
      setIsLoggedIn(false);
      setUserEmail("");
      setUserName("");
    }

    if (adminToken || adminFlag === 'true') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const on = () => setIsWide(window.innerWidth > 1200);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // Синхронизация с пропсами
  useEffect(() => {
    if (propIsLoggedIn !== undefined) {
      setIsLoggedIn(propIsLoggedIn);
    }
    if (propIsAdmin !== undefined) {
      setIsAdmin(propIsAdmin);
    }
  }, [propIsLoggedIn, propIsAdmin]);

  // Проверяем статус входа при загрузке
  useEffect(() => {
    syncAuthFromStorage();
    const onAuthChanged = () => syncAuthFromStorage();
    window.addEventListener("storage", onAuthChanged);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onAuthChanged);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleLoginSuccess = (email: string, isAdmin?: boolean) => {
    setUserEmail(email);
    setUserName("");
    setIsLoggedIn(true);
    
    if (isAdmin) {
      setIsAdmin(true);
      setMode("admin-dashboard");
    } else {
      setIsAdmin(false);
      setMode("objects");
    }
    
    // Сохраняем данные в localStorage для персистентности
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
    
    if (isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    }
    
    // Вызываем обновление состояния в родительском компоненте
    if (onAuthUpdate) {
      onAuthUpdate();
    }

    loadUserProfile(email);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setUserName("");
    setIsAdmin(false);
    setMode("home");

    // Очищаем localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event("auth-changed"));
  };

  const bar: React.CSSProperties = {
    position: "relative",
    marginTop: 12,
    width: "100%",
    paddingRight: isWide ? 32 : 0,
    zIndex: 200,
  };

  // ↑↑ ничего кроме размеров panel не трогаем
  const panel: React.CSSProperties = isWide
    ? {
        // расширили панель на десктопе
        width: "min(58vw, calc(100vw - 64px))",
        maxWidth: "980px",
        minWidth: "320px",
        marginLeft: "auto",
        borderRadius: 9999,
        backdropFilter: "blur(18px)",
        background: "linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.12))",
        border: "2px solid rgba(211, 163, 115, 0.6)",
        boxShadow: "0 8px 24px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.22)",
        padding: "12px 22px", // немного больше внутренний отступ
        overflow: "hidden",
      }
    : {
        width: "96vw",
        margin: "10px auto 0",
        borderRadius: 16, // Меньше радиус для мобильных
        backdropFilter: "blur(18px)",
        background: "linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.12))",
        border: "2px solid rgba(90, 107, 151, 0.6)",
        boxShadow: "0 8px 24px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.22)",
        padding: "8px 12px", // Меньше padding для мобильных
        overflow: "hidden",
      };

  // единый шрифт для всех пунктов — ChinaCyr (fallback Montserrat)
  const linkFont: React.CSSProperties = {
    fontFamily: "ChinaCyr, var(--font-montserrat), sans-serif",
    whiteSpace: "nowrap",
    flexShrink: 1, // Позволяет элементам сжиматься
    minWidth: 0, // Позволяет тексту обрезаться
  };

  const displayName = userName || userEmail || (isAdmin ? "Админ" : "Пользователь");

  return (
    <div style={bar}>
      <nav className={`menu-strip${open ? " open" : ""}`} style={panel}>
        <div
          className="menu-links"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: isWide ? 14 : 6,
            flexWrap: isWide ? "nowrap" : "wrap",
            justifyContent: "center",
            overflow: "hidden",
            minWidth: 0,
          }}
        >

          {!isLoggedIn ? (
            <button
              type="button"
              className="menu-link"
              onClick={() => setIsLoginOpen(true)}
              style={linkFont}
            >
              Вход
            </button>
          ) : (
            <>
              <button
                type="button"
                className={`menu-link ${mode === "admin-dashboard" || mode === "objects" ? 'active' : ''}`}
                onClick={() => setMode(isAdmin ? "admin-dashboard" : "objects")}
                style={{
                  ...linkFont,
                  color: mode === "admin-dashboard" || mode === "objects" ? "rgba(211, 163, 115, 1)" : "rgba(211, 163, 115, 0.9)",
                }}
              >
                {displayName}
              </button>
              <button
                type="button"
                className="menu-link"
                onClick={handleLogout}
                style={{
                  ...linkFont,
                  color: "rgba(239, 68, 68, 0.9)"
                }}
              >
                Выйти
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Панель входа */}
      <LoginPanel 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
