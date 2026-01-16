"use client";

import React from "react";
import { motion } from "framer-motion";

type Service = {
  id: string;
  title: string;
  subtitle?: string;
};

const DEFAULT_SERVICES: Service[] = [
  { id: "s1", title: "Проектирование" },
  { id: "s2", title: "Визуализация" },
  { id: "s3", title: "Реализация" },
  { id: "s4", title: "Сопровождение" },
];

export default function ServicesGrid({ services = DEFAULT_SERVICES }: { services?: Service[] }) {
  const items = services.slice(0, 4);

  return (
    <section className="mt-40 md:mt-44">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-6">
        <div className="servicesGrid">
          {items.map((svc, idx) => (
            <div key={svc.id} className={`svc svc--${idx + 1}`}>
              <ServiceCard title={svc.title} subtitle={svc.subtitle} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .servicesGrid {
          display: grid;
          grid-template-columns: 1fr; /* по умолчанию: мобильные — одна колонка */
          gap: 16px;
          align-items: start;
        }
        @media (min-width: 640px) { /* узкие экраны: по 3 панели */
          .servicesGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }
          .svc { grid-column: auto / span 1; }
        }
        @media (min-width: 1024px) { /* широкие экраны: 13 колонок, 4 панели по 2 колонки с отступами */
          .servicesGrid {
            grid-template-columns: repeat(13, minmax(0, 1fr));
            column-gap: 0; /* зазоры формируем пустыми колонками */
            row-gap: 0;
          }
          .svc { grid-row: 1; }
          .svc--1 { grid-column: 2 / span 2; }
          .svc--2 { grid-column: 5 / span 2; }
          .svc--3 { grid-column: 8 / span 2; }
          .svc--4 { grid-column: 11 / span 2; }
        }
      `}</style>
    </section>
  );
}

function ServiceCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.44, 0.13, 0.35, 1.08] }}
        style={{ position: "relative", width: "100%", borderRadius: 16 }}
      >
        {/* Высота = ширина * 1.41 (aspect-ratio: width / height = 1 / 1.41) */}
        <div
          className="group"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1.41",
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(28px)",
            border: "2.5px solid rgba(211,163,115,0.6)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "stretch",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              padding: "16px 18px",
              color: "white",
              display: "grid",
              gap: 8,
            }}
          >
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.2 }}>{title}</h3>
            {subtitle ? (
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.9)" }}>{subtitle}</p>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
