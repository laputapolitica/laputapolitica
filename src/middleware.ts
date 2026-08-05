import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const ROUTE_ROLES: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin/ediciones", roles: ["admin", "director"] },
  { prefix: "/admin/opinadores", roles: ["admin", "director"] },
  { prefix: "/admin/metricas", roles: ["admin", "director"] },
  { prefix: "/admin/usuarios-y-roles", roles: ["admin"] },
];

function rolesPermitidos(pathname: string): string[] {
  const match = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  if (match) return match.roles;
  // /admin exacto y cualquier otra ruta /admin/* no listada: cualquier staff.
  return ["admin", "editor", "director"];
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const haySesion = Boolean(claims);

  const { pathname } = request.nextUrl;

  const esRutaAdmin =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (esRutaAdmin) {
    if (!haySesion) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    const userId = claims?.sub;
    if (!userId) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    const { data: perfil } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    const rol = perfil?.role ?? null;

    // No es staff → afuera del admin.
    if (!rol) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }

    // Staff sin permiso para esta ruta → a Edición del día.
    if (!rolesPermitidos(pathname).includes(rol)) {
      const adminHome = request.nextUrl.clone();
      adminHome.pathname = "/admin";
      adminHome.search = "";
      return NextResponse.redirect(adminHome);
    }
  }

  // Portal diario de opinadores: requiere sesión.
  const esRutaOpinadorPrivada = pathname.startsWith("/el-pulso/dia");

  if (esRutaOpinadorPrivada && !haySesion) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/el-pulso/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
