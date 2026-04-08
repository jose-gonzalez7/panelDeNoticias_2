import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const MSG_MAX = 800;

/** Construye la URL de la pantalla de error con código HTTP (o clave) y mensaje opcional. */
export function buildErrorUrl(code: number | string, message?: string) {
  const params = new URLSearchParams();
  params.set("code", String(code));
  if (message && message.trim()) {
    params.set("msg", message.trim().slice(0, MSG_MAX));
  }
  return `/error?${params.toString()}`;
}

/** Extrae `error` o `message` de un cuerpo JSON (o texto plano) de una respuesta fallida. */
export function mensajeDesdeCuerpoRespuesta(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  try {
    const data = JSON.parse(trimmed) as Record<string, unknown>;
    const err = data.error;
    const msg = data.message;
    if (typeof err === "string" && err) return err.slice(0, MSG_MAX);
    if (typeof msg === "string" && msg) return msg.slice(0, MSG_MAX);
  } catch {
    /* cuerpo no JSON */
  }
  return trimmed.slice(0, MSG_MAX);
}

/**
 * Si la respuesta HTTP no es correcta, lee el cuerpo (mensaje del backend), redirige a `/error` y lanza.
 * No consume el cuerpo cuando `res.ok` es true (el caller puede usar `res.json()` después).
 */
export async function manejarError(res: Response, router: AppRouterInstance) {
  if (!res.ok) {
    const code = res.status || 500;
    let detail = "";
    try {
      const text = await res.text();
      detail = mensajeDesdeCuerpoRespuesta(text);
    } catch {
      /* ignore */
    }
    router.push(buildErrorUrl(code, detail || undefined));
    throw new Error(`HTTP ${code}`);
  }
}
