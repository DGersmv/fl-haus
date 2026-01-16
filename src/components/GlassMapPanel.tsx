"use client";
import React from "react";
import { motion } from "framer-motion";
import OpenGlobusViewer from "./OpenGlobusViewer";
import { useViewMode } from "@/components/ui/ViewMode";

export default function GlassMapPanel() {
  const { setMode } = useViewMode();
  const pad = 5;

  return (
    <div className="mapWrapper">
      {/* Анимация появления без вертикального сдвига */}
      <motion.div
        className="gpu"                              // ← промоут в композитный слой
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.44, 0.13, 0.35, 1.08] }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          overflow: "hidden",
          pointerEvents: "auto",
          willChange: "opacity, transform",         // ← подсказка композитору
        }}
      >
        <motion.div
          className="group cursor-default gpu"      // ← композитный слой для hover
          
          // ВАЖНО: filter убрали (дорогие репейнты). Оставляем только transform/opacity.
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          style={{
            position: "absolute",
            inset: pad,
            borderRadius: "inherit",
            overflow: "hidden",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(32px)",            // статичный blur ок; не анимируем
            border: "2.5px solid rgba(211, 163, 115, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "transform, opacity",
            contain: "paint",                        // ограничим область перерисовки
          }}
        >
          {/* Контент карты */}
          <motion.div
            className="gpu"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              overflow: "hidden",
              opacity: 0.7,
            }}
            whileHover={{ opacity: 1 }}             // делаем прозрачноcть через Framer (дёшево)
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <OpenGlobusViewer />
          </motion.div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .mapWrapper {
          width: 96vw;
          aspect-ratio: 21 / 12;
          border-radius: 1.7rem;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .mapWrapper {
            position: fixed;             /* фиксируем */
            top: var(--hero-top);        /* тот же уровень, что и текст */
            right: 3%;                   /* прижимаем вправо */
            width: 30vw;
            aspect-ratio: 21 / 9;
            border-radius: 2.2rem;
            margin: 0;                   /* убираем auto-margin */
            z-index: 120;                /* поверх фона, но ниже меню */
          }
        }
      `}</style>
    </div>
  );
}
