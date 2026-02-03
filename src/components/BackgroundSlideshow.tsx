"use client";
import { useEffect, useState, useRef } from "react";

const MOBILE_BREAKPOINT_PX = 768;
const VIDEO_DESKTOP = "/bg/FL-31.mp4";
const VIDEO_MOBILE = "/bg/FL_31_verysmall.mp4";

type Props = {
  videoSrc?: string;
  videoSrcMobile?: string;
  /** Пока видео грузится или при ошибке — показываем фото */
  fallbackImage?: string;
  intervalMs?: number;
  fadeMs?: number;
  kenBurns?: boolean;
};

// 1×1 прозрачный пиксель — без 404, пока грузится видео или нет фото из api/bg
const DEFAULT_FALLBACK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function useIsMobile(breakpointPx: number) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpointPx]);
  return isMobile;
}

export default function BackgroundSlideshow({
  videoSrc = VIDEO_DESKTOP,
  videoSrcMobile = VIDEO_MOBILE,
  fallbackImage = DEFAULT_FALLBACK,
  intervalMs = 7000,
  fadeMs = 1200,
  kenBurns = true,
}: Props) {
  const isMobile = useIsMobile(MOBILE_BREAKPOINT_PX);
  const effectiveVideoSrc = isMobile ? videoSrcMobile : videoSrc;

  const [useVideo, setUseVideo] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Не проверяем HEAD — в dev статика может не отвечать; всегда показываем видео, при onError — fallback
  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);
  }, [effectiveVideoSrc]);

  // Принудительный play() — в части браузеров autoplay срабатывает только так
  useEffect(() => {
    if (!useVideo || videoError || !videoRef.current) return;
    const v = videoRef.current;
    const play = () => {
      v.play().catch(() => {});
    };
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
    return () => v.removeEventListener("loadeddata", play);
  }, [useVideo, videoError, effectiveVideoSrc]);

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
    return () => { mounted = false; };
  }, [useVideo, videoLoaded]);

  useEffect(() => {
    if (useVideo && videoLoaded) return;
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images, intervalMs, useVideo, videoLoaded]);

  const active = images[index];
  const showFallback = !useVideo || videoError || !videoLoaded;

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
      {/* Видео фон: десктоп — FL_31 (~8MB), мобильные — FL_31_verysmall */}
      {useVideo && !videoError && (
        <video
          key={effectiveVideoSrc}
          ref={videoRef}
          src={effectiveVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => {
            setVideoError(true);
            setUseVideo(false);
          }}
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

      {/* Пока видео грузится или нет — фото из api/bg или одно дефолтное */}
      {showFallback && (
        images.length > 0 ? (
          images.map((src) => {
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
                  transition: `opacity ${fadeMs}ms ease-in-out, transform ${Math.max(1000, intervalMs - 300)}ms ease-in-out`,
                  willChange: "opacity, transform",
                }}
              />
            );
          })
        ) : (
          <img
            src={fallbackImage}
            alt=""
            draggable={false}
            decoding="async"
            fetchPriority="high"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )
      )}

      {/* Затемнение */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,.42), rgba(0,0,0,.64))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
