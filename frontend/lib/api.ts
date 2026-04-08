/**
 * Origen del backend (sin /api). Configura en Vercel:
 * NEXT_PUBLIC_API_URL=https://tu-servidor.up.railway.app
 */
const raw =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "https://servidorpanelnoticias-production.up.railway.app";

export const API_ORIGIN = raw.replace(/\/$/, "");

export const API_BASE = `${API_ORIGIN}/api`;
