"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useViewMode } from "@/components/ui/ViewMode";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import DashboardGrid from "@/components/DashboardGrid";
import AdminDashboard from "@/components/AdminDashboard";
import UserObjectsGrid from "@/components/UserObjectsGrid";
import ObjectDetailView from "@/components/ObjectDetailView";
import AdminObjectsManager from "@/components/AdminObjectsManager";
import AdminObjectDetailView from "@/components/AdminObjectDetailView";
import CustomerPhotoViewer from "@/components/CustomerPhotoViewer";
import NotificationToast from "@/components/NotificationToast";
import GlassMapPanel from "@/components/GlassMapPanel";

export default function Home() {
  const { mode, setMode } = useViewMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadComments, setUnreadComments] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const userEmail = localStorage.getItem("userEmail");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");
    const isAdminStatus = localStorage.getItem("isAdmin");

    const authenticated = !!(userEmail && (isLoggedIn === "true" || userToken));
    const admin = !!(adminToken || isAdminStatus === "true");

    setIsAuthenticated(authenticated);
    setIsAdmin(admin);

    if (authenticated && mode === "home") {
      setMode(admin ? "admin-dashboard" : "objects");
    }
  }, [isClient, mode, setMode]);

  useEffect(() => {
    if (!isClient || !isAuthenticated) return;
    loadUnreadNotifications();
  }, [isClient, isAuthenticated]);

  const loadUnreadNotifications = async () => {
    const userEmail = localStorage.getItem("userEmail");
    const adminToken = localStorage.getItem("adminToken");
    const isAdminUser = !!(adminToken || localStorage.getItem("isAdmin") === "true");

    if (!userEmail) return;

    try {
      const response = await fetch(
        `/api/notifications/unread?email=${encodeURIComponent(userEmail)}&isAdmin=${isAdminUser}`
      );
      const data = await response.json();

      if (data.success && data.total > 0) {
        setUnreadMessages(data.unreadMessages || 0);
        setUnreadComments(data.unreadComments || 0);
        setShowNotificationToast(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки уведомлений:", error);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userToken");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setMode("home");
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <main className="relative main-content">
      <div className="fixed inset-0 -z-20">
        <BackgroundSlideshow />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="home-intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <section className="page-wrap">
              <div className="home-intro-layout">
                <div className="home-intro-text">
                  <h2>Кабинет заказчика</h2>
                  <p>
                    В кабинете заказчика можно смотреть объекты и фото, получать файлы
                    и документы, а также оставлять комментарии и сообщения.
                  </p>
                  <p>
                    Для входа нажмите кнопку «Вход» в верхнем меню.
                  </p>
                </div>
                <div className="home-intro-map">
                  <GlassMapPanel />
                </div>
              </div>
            </section>
            <style jsx>{`
              .home-intro-layout {
                display: grid;
                gap: 18px;
                align-items: start;
              }

              .home-intro-text {
                max-width: 720px;
                color: #f6f8fa;
              }

              .home-intro-text h2 {
                margin: 0 0 12px;
              }

              .home-intro-text p {
                margin: 0 0 12px;
                opacity: 0.9;
              }

              .home-intro-text p:last-child {
                margin-bottom: 0;
                opacity: 0.75;
              }

              .home-intro-map {
                width: 100%;
              }

              @media (min-width: 1024px) {
                .home-intro-layout {
                  grid-template-columns: minmax(0, 1fr) minmax(0, 30vw);
                  gap: 24px;
                }
              }
            `}</style>
          </motion.div>
        ) : mode === "admin-dashboard" && isAdmin ? (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <AdminDashboard
              userEmail={localStorage.getItem("userEmail") || "admin"}
              onLogout={handleAdminLogout}
            />
          </motion.div>
        ) : mode === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <DashboardGrid />
          </motion.div>
        ) : mode === "objects" ? (
          <motion.div
            key="objects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <UserObjectsGrid userEmail={localStorage.getItem("userEmail") || ""} />
          </motion.div>
        ) : mode === "object-detail" ? (
          <motion.div
            key="object-detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <ObjectDetailView userEmail={localStorage.getItem("userEmail") || ""} />
          </motion.div>
        ) : mode === "admin-objects" && isAdmin ? (
          <motion.div
            key="admin-objects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <AdminObjectsManager adminToken={localStorage.getItem("adminToken") || ""} />
          </motion.div>
        ) : mode === "admin-object-detail" && isAdmin ? (
          <motion.div
            key="admin-object-detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <AdminObjectDetailView adminToken={localStorage.getItem("adminToken") || ""} />
          </motion.div>
        ) : mode === "photo-viewer" ? (
          <motion.div
            key="photo-viewer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <CustomerPhotoViewer userEmail={localStorage.getItem("userEmail") || ""} />
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <DashboardGrid />
          </motion.div>
        )}
      </AnimatePresence>

      {showNotificationToast && (
        <NotificationToast
          unreadMessages={unreadMessages}
          unreadComments={unreadComments}
          onClose={() => setShowNotificationToast(false)}
        />
      )}
    </main>
  );
}
