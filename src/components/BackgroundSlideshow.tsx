"use client";
import { useEffect, useState, useRef } from "react";

type Props = {
  videoSrc?: string;
  // Для fallback на слайдшоу, если видео нет
  intervalMs?: number;
  fadeMs?: number;
  kenBurns?: boolean;
};

export default function BackgroundSlideshow({
  videoSrc = "/bg/fl_31.mp4",
  intervalMs = 7000,
  fadeMs = 1200,
  kenBurns = true,
}: Props) {
  const [useVideo, setUseVideo] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Проверяем, доступно ли видео
  useEffect(() => {
    const checkVideo = async () => {
      try {
        const res = await fetch(videoSrc, { method: "HEAD" });
        if (res.ok) {
          setUseVideo(true);
        } else {
          setUseVideo(false);
        }
      } catch {
        setUseVideo(false);
      }
    };
    checkVideo();
  }, [videoSrc]);

  // Fallback: тянем список картинок из API
  useEffect(() => {
    if (useVideo && videoLoaded) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/bg", { cache: "no-store" });
        const data = (await res.json()) as { images: string[] };
        if (mounted) setImages(Array.isArray(data.images) ? data.images : []);
      } catch {
        if (mounted) setImages([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [useVideo, videoLoaded]);

  // Цикл слайдшоу (fallback)
  useEffect(() => {
    if (useVideo && videoLoaded) return;
    if (images.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [images, intervalMs, useVideo, videoLoaded]);

  // Предзагрузка следующего кадра (fallback)
  useEffect(() => {
    if (useVideo && videoLoaded) return;
    if (!images.length) return;
    const next = images[(index + 1) % images.length];
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = next;
  }, [index, images, useVideo, videoLoaded]);

  const active = images[index];

  return (
    <div
      aria-hidden
      className="gpu fixed-layer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        background: "#000",
        pointerEvents: "none",
      }}
    >
      {/* Видео фон */}
      {useVideo && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setUseVideo(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: videoLoaded ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />
      )}

      {/* Fallback слайдшоу (показываем пока видео не загрузилось или если его нет) */}
      {(!useVideo || !videoLoaded) && images.length > 0 && images.map((src) => {
        const isActive = src === active;
        return (
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            decoding="async"
            loading={isActive ? "eager" : "lazy"}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isActive ? 1 : 0,
              transform: isActive && kenBurns ? "scale(1.04)" : "scale(1)",
              transformOrigin: "center center",
              transitionProperty: "opacity, transform",
              transitionDuration: `${fadeMs}ms, ${Math.max(
                1000,
                intervalMs - 300
              )}ms`,
              transitionTimingFunction: "ease-in-out, ease-in-out",
              willChange: "opacity, transform",
            }}
          />
        );
      })}

      {/* Мягкое затемнение */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,.42), rgba(0,0,0,.64))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
