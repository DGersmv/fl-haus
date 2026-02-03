// src/app/api/figma/projects/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const FIGMA_API = "https://api.figma.com/v1";

export async function GET(request: NextRequest) {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "FIGMA_ACCESS_TOKEN не задан в .env.local" },
      { status: 401 }
    );
  }

  const teamId = request.nextUrl.searchParams.get("team_id");
  if (!teamId) {
    return NextResponse.json(
      {
        error:
          "Укажите team_id в query. team_id берётся из URL Figma: figma.com/files/team/ЗДЕСЬ_ID/...",
      },
      { status: 400 }
    );
  }

  const headers = { "X-Figma-Token": token };

  try {
    // Список проектов команды
    const projectsRes = await fetch(
      `${FIGMA_API}/teams/${encodeURIComponent(teamId)}/projects`,
      { headers }
    );

    if (!projectsRes.ok) {
      const text = await projectsRes.text();
      return NextResponse.json(
        {
          error: `Figma API projects: ${projectsRes.status}`,
          details: text,
          hint: "Проверьте team_id в URL Figma (figma.com/files/team/XXX/...). Нужен scope projects:read.",
        },
        { status: projectsRes.status }
      );
    }

    const projectsData = await projectsRes.json();
    const projects = projectsData.projects ?? [];

    // Для каждого проекта — список файлов
    const projectsWithFiles = await Promise.all(
      projects.map(async (p: { id: string; name: string }) => {
        const filesRes = await fetch(
          `${FIGMA_API}/projects/${encodeURIComponent(p.id)}/files`,
          { headers }
        );
        const filesData = filesRes.ok ? await filesRes.json() : { files: [] };
        return {
          id: p.id,
          name: p.name,
          files: filesData.files ?? [],
        };
      })
    );

    return NextResponse.json({
      team_id: teamId,
      projects: projectsWithFiles,
    });
  } catch (e) {
    console.error("figma projects error", e);
    return NextResponse.json(
      { error: "Ошибка запроса к Figma API" },
      { status: 500 }
    );
  }
}
