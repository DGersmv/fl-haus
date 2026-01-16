"use client";

import DashboardGrid from "@/components/DashboardGrid";
import HeaderMenu from "@/components/HeaderMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Небольшая задержка для предотвращения мерцания
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Проверяем аутентификацию
    // В реальном приложении здесь была бы проверка JWT токена или сессии
    const checkAuth = async () => {
      try {
        // Пока что просто проверяем, есть ли email в localStorage
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          setIsAuthenticated(true);
        } else {
          // Если нет аутентификации, перенаправляем на главную
          router.push('/');
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isClient]);

  if (!isClient || isLoading) {
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

  if (!isAuthenticated) {
    return null; // Редирект уже выполнен в useEffect
  }

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      width: "100%"
    }}>
      <HeaderMenu />
      <DashboardGrid />
      
    </div>
  );
}
