// Отладка: видит ли сервер FIGMA_ACCESS_TOKEN (значение не показываем)
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const set = Boolean(token?.trim());
  return NextResponse.json({
    FIGMA_ACCESS_TOKEN_set: set,
    cwd: process.cwd(),
    hint: set
      ? "Токен загружен. Если /api/figma/me всё ещё 401 — проблема в Figma API."
      : "Токен не загружен. Проверьте .env.local в корне проекта и перезапустите npm run dev.",
  });
}
