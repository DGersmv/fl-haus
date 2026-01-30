"use client";

import React, { useState, useEffect } from "react";
import AdminCustomerPanels from "./AdminCustomerPanels";

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export default function AdminDashboard({ userEmail, onLogout }: AdminDashboardProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Получаем токен из localStorage
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 9999
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: "4px solid rgba(255,255,255,0.3)",
          borderTop: "4px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "24px",
          textAlign: "center",
          color: "white",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", marginBottom: "16px" }}>
            Ошибка авторизации
          </h2>
          <p style={{ marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>
            Токен не найден. Пожалуйста, войдите заново.
          </p>
          <button
            onClick={onLogout}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "rgba(211, 163, 115, 0.8)",
              color: "white",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "absolute",
      top: "200px",
      left: "0",
      right: "0",
      minHeight: "100vh",
      zIndex: 10,
      padding: "0 2rem",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      {/* Заголовок */}
      <div style={{
        textAlign: "center",
        marginBottom: "32px",
        color: "white"
      }}>
        <h1 style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "2.5rem",
          fontWeight: 800,
          marginBottom: "10px",
        }}>
          Админ панель
        </h1>
        <p style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "1.1rem",
          color: "rgba(255,255,255,0.8)",
          marginBottom: "8px"
        }}>
          Добро пожаловать, {userEmail}
        </p>
        <p style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.6)"
        }}>
          Управление пользователями и проектами
        </p>
      </div>


      {/* Панели заказчиков */}
      <AdminCustomerPanels adminToken={token} />

      {/* Статистика */}
      <div style={{
        marginTop: "32px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px"
      }}>

        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center",
          backdropFilter: "blur(10px)"
        }}>
          <h3 style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.5rem",
            marginBottom: "8px",
            color: "white"
          }}>
            Активные проекты
          </h3>
          <p style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "rgba(34, 197, 94, 1)"
          }}>
            0
          </p>
        </div>

        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center",
          backdropFilter: "blur(10px)"
        }}>
          <h3 style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.5rem",
            marginBottom: "8px",
            color: "white"
          }}>
            Завершенные проекты
          </h3>
          <p style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "rgba(59, 130, 246, 1)"
          }}>
            0
          </p>
        </div>
      </div>
    </div>
  );
}
