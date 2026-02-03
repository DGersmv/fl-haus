// src/app/api/figma/me/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const FIGMA_API = "https://api.figma.com/v1";

export async function GET() {
  const token = process.env.FIGMA_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      {
        error: "FIGMA_ACCESS_TOKEN не задан в .env.local",
        debug: {
          token_set: false,
          hint: "Файл .env.local должен быть в корне проекта (рядом с package.json). После правок перезапустите: npm run dev",
        },
      },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${FIGMA_API}/me`, {
      headers: { "X-Figma-Token": token },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Figma API: ${res.status}`, details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("figma me error", e);
    return NextResponse.json(
      { error: "Ошибка запроса к Figma API" },
      { status: 500 }
    );
  }
}
