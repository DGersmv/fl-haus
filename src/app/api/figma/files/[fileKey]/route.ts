// GET /api/figma/files/[fileKey] — метаданные или полный файл из Figma
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const FIGMA_API = "https://api.figma.com/v1";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileKey: string }> }
) {
  const token = process.env.FIGMA_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      { error: "FIGMA_ACCESS_TOKEN не задан в .env.local" },
      { status: 401 }
    );
  }

  const { fileKey } = await params;
  if (!fileKey) {
    return NextResponse.json(
      { error: "Укажите fileKey в URL (из ссылки Figma: figma.com/design/FILE_KEY/...)" },
      { status: 400 }
    );
  }

  const url = new URL(_request.url);
  const full = url.searchParams.get("full") === "1";

  const headers = { "X-Figma-Token": token };

  try {
    if (full) {
      // Полный файл (дерево, компоненты) — может быть большим
      const res = await fetch(
        `${FIGMA_API}/files/${encodeURIComponent(fileKey)}?depth=2`,
        { headers }
      );
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { error: `Figma API: ${res.status}`, details: text },
          { status: res.status }
        );
      }
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Только метаданные (название, превью, дата)
    const res = await fetch(
      `${FIGMA_API}/files/${encodeURIComponent(fileKey)}/meta`,
      { headers }
    );
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
    console.error("figma file error", e);
    return NextResponse.json(
      { error: "Ошибка запроса к Figma API" },
      { status: 500 }
    );
  }
}
