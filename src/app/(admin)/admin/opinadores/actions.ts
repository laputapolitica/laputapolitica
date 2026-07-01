"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { VOTE_COLORS } from "@/lib/constants";
import type { EdicionOpinador } from "@/types/admin";
import type { OpinadorEdicion } from "@/app/(admin)/admin/actions";
import type { OpinadorAdmin, Postulacion } from "@/types/admin";

type PostulacionRow = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  provincia: string;
  edad: number;
  motivacion: string;
  estado: string;
  created_at: string;
};

function mapEstado(estado: string): Postulacion["estado"] {
  return estado === "rejected" ? "rechazado" : "pendiente";
}

function mapPostulacion(row: PostulacionRow): Postulacion {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono ?? "",
    ciudad: row.provincia,
    edad: row.edad,
    fechaPostulacion: formatFechaCorta(row.created_at),
    motivacion: row.motivacion,
    estado: mapEstado(row.estado),
  };
}

export async function getPostulaciones(): Promise<{
  pendientes: Postulacion[];
  rechazados: Postulacion[];
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("postulaciones")
    .select("id, nombre, email, telefono, provincia, edad, motivacion, estado, created_at")
    .in("estado", ["pending", "rejected"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error leyendo postulaciones:", error.message);
    return { pendientes: [], rechazados: [] };
  }

  const rows = (data ?? []) as PostulacionRow[];
  const mapped = rows.map(mapPostulacion);

  return {
    pendientes: mapped.filter((p) => p.estado === "pendiente"),
    rechazados: mapped.filter((p) => p.estado === "rechazado"),
  };
}

export type RechazarResult = {
  error?: string;
  success?: boolean;
};

export async function rechazarPostulacion(
  id: string,
): Promise<RechazarResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const { error } = await supabase
    .from("postulaciones")
    .update({
      estado: "rejected",
      revisada_por: user.id,
      revisada_en: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error rechazando postulación:", error.message);
    return { error: "No pudimos rechazar la postulación. Intentá de nuevo." };
  }

  return { success: true };
}

export type AprobarResult = {
  error?: string;
  success?: boolean;
  passwordTemporal?: string;
  numeroUsuario?: number;
};

function generarPasswordTemporal(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) {
    out += chars[b % chars.length];
  }
  return out;
}

export async function aprobarPostulacion(id: string): Promise<AprobarResult> {
  const supabase = await createClient();

  // 1. Verificar staff con sesión.
  const { data: userData } = await supabase.auth.getUser();
  const reviewer = userData.user;
  if (!reviewer) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  // 2. Leer la postulación.
  const { data: post, error: postError } = await supabase
    .from("postulaciones")
    .select("id, nombre, email, telefono, provincia, edad, pais, estado")
    .eq("id", id)
    .maybeSingle();

  if (postError || !post) {
    return { error: "No se encontró la postulación." };
  }
  if (post.estado === "approved") {
    return { error: "Esta postulación ya fue aprobada." };
  }

  const admin = createAdminClient();

  // 3. Generar contraseña temporal.
  const passwordTemporal = generarPasswordTemporal();

  // 4. Crear el usuario de auth (auto-confirmado).
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: post.email,
    password: passwordTemporal,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const msg = createError?.message ?? "";
    if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered")) {
      return { error: "Ya existe un usuario con ese email. Revisá si esta persona ya es opinador." };
    }
    console.error("Error creando usuario de auth:", msg);
    return { error: "No pudimos crear el usuario. Intentá de nuevo." };
  }

  const nuevoUserId = created.user.id;

  // 5. Calcular numero_usuario (máximo actual + 1).
  const { data: maxRows } = await admin
    .from("opinadores")
    .select("numero_usuario")
    .order("numero_usuario", { ascending: false })
    .limit(1);

  const numeroUsuario =
    maxRows && maxRows.length > 0 ? maxRows[0].numero_usuario + 1 : 1;

  // 6. Insertar la fila en opinadores (hereda pais de la postulación).
  const { error: insertError } = await admin.from("opinadores").insert({
    id: nuevoUserId,
    postulacion_id: post.id,
    numero_usuario: numeroUsuario,
    nombre: post.nombre,
    email: post.email,
    telefono: post.telefono ?? "",
    edad: post.edad,
    provincia: post.provincia,
    pais: post.pais,
  });

  if (insertError) {
    // Rollback: borrar el usuario de auth recién creado para no dejar basura.
    await admin.auth.admin.deleteUser(nuevoUserId);
    console.error("Error insertando opinador:", insertError.message);
    return { error: "No pudimos crear el opinador. Intentá de nuevo." };
  }

  // 7. Marcar la postulación como aprobada.
  const { error: updateError } = await admin
    .from("postulaciones")
    .update({
      estado: "approved",
      revisada_por: reviewer.id,
      revisada_en: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    console.error("Error actualizando postulación (opinador ya creado):", updateError.message);
    // El opinador ya existe; informamos pero no revertimos esa creación.
    return {
      error: "El opinador se creó, pero no se pudo actualizar la postulación. Avisá al equipo.",
    };
  }

  // 8. Devolver la contraseña temporal para mostrarla una vez.
  return { success: true, passwordTemporal, numeroUsuario };
}

type OpinadorRow = {
  id: string;
  numero_usuario: number;
  nombre: string;
  email: string;
  telefono: string | null;
  provincia: string;
  edad: number;
  ingreso_en: string;
};

function formatFechaCorta(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
}

export async function getOpinadores(): Promise<OpinadorAdmin[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("opinadores")
    .select("id, numero_usuario, nombre, email, telefono, provincia, edad, ingreso_en")
    .eq("activo", true)
    .order("numero_usuario", { ascending: true });

  if (error) {
    console.error("Error leyendo opinadores:", error.message);
    return [];
  }

  const rows = (data ?? []) as OpinadorRow[];
  if (rows.length === 0) {
    return [];
  }

  // Ediciones publicadas: base para el denominador (depende del ingreso de cada opinador).
  const { data: edData } = await supabase
    .from("ediciones")
    .select("id, publicada_en")
    .eq("estado", "published");
  const ediciones = (edData ?? []) as { id: string; publicada_en: string | null }[];

  // Noticias de esas ediciones.
  const edIds = ediciones.map((e) => e.id);
  let noticias: { id: string; edicion_id: string }[] = [];
  if (edIds.length > 0) {
    const { data: ntData } = await supabase
      .from("noticias")
      .select("id, edicion_id")
      .in("edicion_id", edIds);
    noticias = (ntData ?? []) as { id: string; edicion_id: string }[];
  }

  // Opiniones de los opinadores activos.
  const opIds = rows.map((r) => r.id);
  const { data: opData } = await supabase
    .from("opiniones")
    .select("opinador_id, noticia_id")
    .in("opinador_id", opIds);
  const opiniones = (opData ?? []) as { opinador_id: string; noticia_id: string }[];

  // Mapa noticia -> edicion.
  const noticiaEdicion = new Map<string, string>();
  for (const n of noticias) {
    noticiaEdicion.set(n.id, n.edicion_id);
  }

  return rows.map((r) => {
    const ingreso = new Date(r.ingreso_en).getTime();

    // Ediciones publicadas a partir del ingreso de este opinador.
    const edicionesValidas = new Set(
      ediciones
        .filter(
          (e) => e.publicada_en && new Date(e.publicada_en).getTime() >= ingreso,
        )
        .map((e) => e.id),
    );

    const totalDias = edicionesValidas.size;
    const totalNoticias = noticias.filter((n) =>
      edicionesValidas.has(n.edicion_id),
    ).length;

    const misOpiniones = opiniones.filter((o) => o.opinador_id === r.id);
    const noticiasOpinadas = new Set<string>();
    const edicionesParticipadas = new Set<string>();
    for (const o of misOpiniones) {
      const edId = noticiaEdicion.get(o.noticia_id);
      if (edId && edicionesValidas.has(edId)) {
        noticiasOpinadas.add(o.noticia_id);
        edicionesParticipadas.add(edId);
      }
    }

    return {
      id: r.numero_usuario,
      nombre: r.nombre,
      email: r.email,
      telefono: r.telefono ?? "",
      ciudad: r.provincia,
      edad: r.edad,
      fechaInicio: formatFechaCorta(r.ingreso_en),
      diasParticipados: edicionesParticipadas.size,
      totalDias,
      noticiasOpinadas: noticiasOpinadas.size,
      totalNoticias,
      ediciones: [],
    };
  });
}

export type DesactivarResult = {
  error?: string;
  success?: boolean;
};

export async function desactivarOpinador(
  numeroUsuario: number,
): Promise<DesactivarResult> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const admin = createAdminClient();

  // Buscar el UUID real del opinador a partir de su numero_usuario.
  const { data: op, error: findError } = await admin
    .from("opinadores")
    .select("id")
    .eq("numero_usuario", numeroUsuario)
    .maybeSingle();

  if (findError || !op) {
    return { error: "No se encontró el opinador." };
  }

  // 1. Desactivar la fila (preserva el historial de opiniones).
  const { error: updateError } = await admin
    .from("opinadores")
    .update({ activo: false })
    .eq("id", op.id);

  if (updateError) {
    console.error("Error desactivando opinador:", updateError.message);
    return { error: "No pudimos desactivar el opinador. Intentá de nuevo." };
  }

  // 2. Banear el usuario de auth para que no pueda loguear (baneo permanente).
  const { error: banError } = await admin.auth.admin.updateUserById(op.id, {
    ban_duration: "876000h",
  });

  if (banError) {
    console.error("Opinador desactivado, pero falló el baneo de auth:", banError.message);
    // La fila ya está activo=false (las queries lo filtran), así que el
    // opinador no opera aunque el baneo de auth no se haya aplicado.
    return { success: true };
  }

  return { success: true };
}

const MESES_OPINADOR = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

function formatFechaEdicion(slug: string): { fecha: string; fechaISO: string } {
  const [dd, mm, yyyy] = slug.split("-");
  const mesIdx = Number(mm) - 1;
  return {
    fecha: `${dd} ${MESES_OPINADOR[mesIdx] ?? mm} ${yyyy}`,
    fechaISO: `${yyyy}-${mm}-${dd}`,
  };
}

type SentimentOpinion = "positiva" | "negativa" | "incierta";

function isSentimentOpinion(v: string | null): v is SentimentOpinion {
  return v === "positiva" || v === "negativa" || v === "incierta";
}

const INTERPRETACION_LABEL_OPINADOR: Record<SentimentOpinion, string> = {
  positiva: "Positiva",
  negativa: "Negativa",
  incierta: "Incierta",
};

export async function getEdicionesOpinador(
  numeroUsuario: number,
): Promise<EdicionOpinador[]> {
  const supabase = await createClient();

  const { data: op } = await supabase
    .from("opinadores")
    .select("id, ingreso_en")
    .eq("numero_usuario", numeroUsuario)
    .maybeSingle();
  if (!op) return [];

  const { data: edData, error: edError } = await supabase
    .from("ediciones")
    .select("id, fecha, titulo, publicada_en")
    .eq("estado", "published")
    .gte("publicada_en", op.ingreso_en)
    .order("publicada_en", { ascending: false });
  if (edError || !edData || edData.length === 0) return [];

  const ediciones = edData as {
    id: string;
    fecha: string;
    titulo: string;
    publicada_en: string | null;
  }[];
  const edIds = ediciones.map((e) => e.id);

  const { data: ntData } = await supabase
    .from("noticias")
    .select("id, edicion_id, orden")
    .in("edicion_id", edIds);
  const noticias = (ntData ?? []) as {
    id: string;
    edicion_id: string;
    orden: number;
  }[];

  const ntIds = noticias.map((n) => n.id);
  let opiniones: { noticia_id: string; sentiment: string | null }[] = [];
  if (ntIds.length > 0) {
    const { data: opData } = await supabase
      .from("opiniones")
      .select("noticia_id, sentiment")
      .eq("opinador_id", op.id)
      .in("noticia_id", ntIds);
    opiniones = (opData ?? []) as {
      noticia_id: string;
      sentiment: string | null;
    }[];
  }
  const sentimentPorNoticia = new Map(
    opiniones.map((o) => [o.noticia_id, o.sentiment]),
  );

  return ediciones.map((ed) => {
    const ntEd = noticias
      .filter((n) => n.edicion_id === ed.id)
      .sort((a, b) => a.orden - b.orden);
    const votos = ntEd.map((n) => {
      const s = sentimentPorNoticia.get(n.id) ?? null;
      return isSentimentOpinion(s) ? VOTE_COLORS[s] : null;
    });
    const participo = ntEd.some((n) => sentimentPorNoticia.has(n.id));
    const { fecha, fechaISO } = formatFechaEdicion(ed.fecha);
    return { edicionId: ed.id, fecha, fechaISO, titulo: ed.titulo, votos, participo };
  });
}

export async function getOpinionesOpinadorEdicion(
  numeroUsuario: number,
  edicionId: string,
): Promise<OpinadorEdicion | null> {
  const supabase = await createClient();

  const { data: op } = await supabase
    .from("opinadores")
    .select("id, nombre, email, provincia")
    .eq("numero_usuario", numeroUsuario)
    .maybeSingle();
  if (!op) return null;

  const { data: ntData } = await supabase
    .from("noticias")
    .select("id, orden, titulo")
    .eq("edicion_id", edicionId)
    .order("orden", { ascending: true });
  const noticias = ((ntData ?? []) as {
    id: string;
    orden: number;
    titulo: string;
  }[]).sort((a, b) => a.orden - b.orden);

  if (noticias.length === 0) {
    return {
      id: op.id,
      nombre: op.nombre,
      email: op.email,
      ciudad: op.provincia,
      votos: [],
      completadas: 0,
      opiniones: [],
    };
  }

  const { data: opData } = await supabase
    .from("opiniones")
    .select("noticia_id, texto, sentiment")
    .eq("opinador_id", op.id)
    .in("noticia_id", noticias.map((n) => n.id));
  const porNoticia = new Map(
    ((opData ?? []) as {
      noticia_id: string;
      texto: string | null;
      sentiment: string | null;
    }[]).map((o) => [o.noticia_id, o]),
  );

  const votos: (string | null)[] = [];
  let completadas = 0;
  const opinionesView = noticias.map((n) => {
    const o = porNoticia.get(n.id);
    if (o) completadas += 1;
    const s = o && isSentimentOpinion(o.sentiment) ? o.sentiment : null;
    const color = s ? VOTE_COLORS[s] : VOTE_COLORS.nula;
    votos.push(s ? color : null);
    return {
      noticia: n.titulo,
      texto: o?.texto ?? "",
      interpretacion: s ? INTERPRETACION_LABEL_OPINADOR[s] : "",
      color,
    };
  });

  return {
    id: op.id,
    nombre: op.nombre,
    email: op.email,
    ciudad: op.provincia,
    votos,
    completadas,
    opiniones: opinionesView,
  };
}
