"use client";

import { useEffect } from "react";

/**
 * В dev скрывает в консоли сообщения [Fast Refresh] rebuilding / done in ...
 * Остальные console.log не трогает.
 */
export default function SuppressFastRefreshLogs() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const skip = (args: unknown[]) => {
      const msg = args[0];
      if (typeof msg === "string") {
        if (msg.includes("[Fast Refresh]")) return true;
        if (msg.includes("Multiple instances of Three.js")) return true;
      }
      return false;
    };
    const origLog = console.log;
    const origWarn = console.warn;
    console.log = (...args: unknown[]) => {
      if (skip(args)) return;
      origLog.apply(console, args);
    };
    console.warn = (...args: unknown[]) => {
      if (skip(args)) return;
      origWarn.apply(console, args);
    };
    return () => {
      console.log = origLog;
      console.warn = origWarn;
    };
  }, []);
  return null;
}
