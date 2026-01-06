import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

//Función que maneja errores de respuestas HTTP en todas las peticiones fetch
export function manejarError(res: Response, router: AppRouterInstance) {
  if (!res.ok) {

    const code = res.status || 500;
    router.push(`/error?code=${code}`); //Redirecciona a la página de error
    throw new Error(`HTTP ${code}`); //Lanza error para poder manejar el fallo

  }
}
