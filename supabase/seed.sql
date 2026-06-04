-- seed.sql
-- Datos de prueba (dev) para La Puta Politica, pais AR.
-- Idempotente: usa IDs fijos + ON CONFLICT DO NOTHING. Se puede re-correr.
-- NO incluye profiles ni opinadores (FK a auth.users): se cargan en el sprint de auth.

-- Fuentes de noticias
insert into public.fuentes_noticias (id, nombre, url, rss_url, tipo, activa, prioridad)
values
  (gen_random_uuid(), 'Clarin', 'https://www.clarin.com', null, 'medio', true, 10),
  (gen_random_uuid(), 'La Nacion', 'https://www.lanacion.com.ar', null, 'medio', true, 20),
  (gen_random_uuid(), 'Infobae', 'https://www.infobae.com', null, 'medio', true, 30),
  (gen_random_uuid(), 'Pagina 12', 'https://www.pagina12.com.ar', null, 'medio', true, 40),
  (gen_random_uuid(), 'Ambito', 'https://www.ambito.com', null, 'medio', true, 50),
  (gen_random_uuid(), 'Telam', 'https://www.telam.com.ar', null, 'agencia', true, 60)
on conflict (url) do nothing;

-- Ediciones (3 estados: published / awaiting_review / in_progress)
insert into public.ediciones (id, fecha, titulo, bajada, portada_url, estado, publicada_en)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '02-06-2026', 'Equilibrio ciego', 'El Congreso en el centro de la escena.', null, 'published', '2026-06-02 22:00:00-03'),
  ('aaaaaaaa-0000-0000-0000-000000000002', '03-06-2026', 'Cuentas pendientes', 'Gobernadores y la agenda federal.', null, 'awaiting_review', null),
  ('aaaaaaaa-0000-0000-0000-000000000003', '04-06-2026', 'En construccion', null, null, 'in_progress', null)
on conflict (id) do nothing;

-- Pipeline state
insert into public.pipeline_state
  (edicion_id, relevamiento_status, titulos_status, portada_status, ventana_opinion_status, el_pulso_status, web_status, instagram_status, twitter_status, publicacion_status)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'done', 'pending'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'running', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending')
on conflict (edicion_id) do nothing;

-- Noticias edicion 1 (published)
insert into public.noticias (id, edicion_id, orden, titulo, cuerpo, fuentes_urls)
values
  ('bbbbbbbb-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 1, 'El Congreso debate el nuevo presupuesto', 'La sesion concentro las posiciones de los principales bloques en torno a las partidas clave.', array['https://www.clarin.com']),
  ('bbbbbbbb-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000001', 2, 'Tension cambiaria tras los anuncios economicos', 'El mercado reacciono con cautela a las medidas presentadas durante la jornada.', array['https://www.ambito.com']),
  ('bbbbbbbb-0000-0000-0000-000000000013', 'aaaaaaaa-0000-0000-0000-000000000001', 3, 'Provincias reclaman fondos de coparticipacion', 'Varios gobernadores pidieron una revision del esquema de distribucion.', array['https://www.lanacion.com.ar']),
  ('bbbbbbbb-0000-0000-0000-000000000014', 'aaaaaaaa-0000-0000-0000-000000000001', 4, 'Reforma laboral: posturas enfrentadas', 'Sindicatos y camaras empresarias expusieron visiones opuestas.', array['https://www.pagina12.com.ar']),
  ('bbbbbbbb-0000-0000-0000-000000000015', 'aaaaaaaa-0000-0000-0000-000000000001', 5, 'Encuesta: la opinion publica ante las medidas', 'Un relevamiento mostro una sociedad dividida frente al rumbo economico.', array['https://www.infobae.com'])
on conflict (id) do nothing;

-- Noticias edicion 2 (awaiting_review)
insert into public.noticias (id, edicion_id, orden, titulo, cuerpo, fuentes_urls)
values
  ('bbbbbbbb-0000-0000-0000-000000000021', 'aaaaaaaa-0000-0000-0000-000000000002', 1, 'Reunion de gobernadores por la agenda federal', 'El encuentro busco coordinar reclamos comunes ante el gobierno nacional.', array['https://www.lanacion.com.ar']),
  ('bbbbbbbb-0000-0000-0000-000000000022', 'aaaaaaaa-0000-0000-0000-000000000002', 2, 'Inflacion de mayo: las primeras estimaciones', 'Las consultoras anticipan un numero en linea con el mes anterior.', array['https://www.ambito.com']),
  ('bbbbbbbb-0000-0000-0000-000000000023', 'aaaaaaaa-0000-0000-0000-000000000002', 3, 'Debate por la ley de financiamiento universitario', 'El proyecto avanzo en comision en medio de fuertes cruces.', array['https://www.pagina12.com.ar']),
  ('bbbbbbbb-0000-0000-0000-000000000024', 'aaaaaaaa-0000-0000-0000-000000000002', 4, 'Politica exterior: nueva ronda de negociaciones', 'La cancilleria retomo conversaciones con socios de la region.', array['https://www.infobae.com']),
  ('bbbbbbbb-0000-0000-0000-000000000025', 'aaaaaaaa-0000-0000-0000-000000000002', 5, 'Oficialismo y oposicion miden fuerzas en comisiones', 'El armado de mayorias define el ritmo del temario parlamentario.', array['https://www.clarin.com'])
on conflict (id) do nothing;

-- El Pulso por noticia
insert into public.el_pulso_noticia (id, noticia_id, texto_resumen, pct_positiva, pct_negativa, pct_incierta, total_opiniones, generated_at)
values
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000011', 'La comunidad ve con cautela el debate presupuestario.', 45, 35, 20, 22, '2026-06-02 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000012', 'Predomina la preocupacion por la tension cambiaria.', 20, 60, 20, 22, '2026-06-02 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000013', 'Amplio apoyo al reclamo de las provincias.', 65, 20, 15, 22, '2026-06-02 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000014', 'Tema que divide fuertemente a la comunidad.', 38, 42, 20, 22, '2026-06-02 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000015', 'Lecturas mixtas sobre el clima social.', 33, 33, 34, 22, '2026-06-02 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000021', 'Buena recepcion del trabajo conjunto entre provincias.', 58, 25, 17, 18, '2026-06-03 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000022', 'Expectativa negativa frente al dato inflacionario.', 18, 62, 20, 18, '2026-06-03 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000023', 'Fuerte respaldo al financiamiento universitario.', 70, 18, 12, 18, '2026-06-03 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000024', 'Opiniones repartidas sobre la estrategia exterior.', 40, 35, 25, 18, '2026-06-03 21:00:00-03'),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000025', 'Escepticismo ante el pulso parlamentario.', 30, 45, 25, 18, '2026-06-03 21:00:00-03')
on conflict (noticia_id) do nothing;

-- Publicacion web (edicion 1) + slides
insert into public.publicacion_web (id, edicion_id, titulo, estado, published_at)
values ('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Equilibrio ciego', 'published', '2026-06-02 22:00:00-03')
on conflict (edicion_id) do nothing;

insert into public.slides_web (id, publicacion_web_id, orden, tipo, titulo, cuerpo)
values
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 1, 'portada', 'Equilibrio ciego', 'Edicion del 02 de junio.'),
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 2, 'noticia', 'El Congreso debate el nuevo presupuesto', 'La sesion concentro las posiciones de los principales bloques.'),
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 3, 'noticia', 'Tension cambiaria tras los anuncios', 'El mercado reacciono con cautela a las medidas.'),
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 4, 'noticia', 'Provincias reclaman coparticipacion', 'Gobernadores pidieron revisar la distribucion.'),
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 5, 'noticia', 'Reforma laboral: posturas enfrentadas', 'Sindicatos y camaras expusieron visiones opuestas.'),
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 6, 'noticia', 'La opinion publica ante las medidas', 'Una sociedad dividida frente al rumbo economico.'),
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 7, 'cierre', 'El Pulso del dia', 'Asi opino la comunidad de La Puta Politica.')
on conflict (publicacion_web_id, orden) do nothing;

-- Publicacion instagram (edicion 1) + slides
insert into public.publicacion_instagram (id, edicion_id, caption, estado, published_manual_at)
values ('dddddddd-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'El resumen politico del dia en 4 placas.', 'published_manual', '2026-06-02 22:05:00-03')
on conflict (edicion_id) do nothing;

insert into public.slides_instagram (id, publicacion_instagram_id, orden, texto)
values
  (gen_random_uuid(), 'dddddddd-0000-0000-0000-000000000001', 1, 'Equilibrio ciego - 02/06'),
  (gen_random_uuid(), 'dddddddd-0000-0000-0000-000000000001', 2, 'Presupuesto: el debate que paro al Congreso.'),
  (gen_random_uuid(), 'dddddddd-0000-0000-0000-000000000001', 3, 'Provincias vs. Nacion por los fondos.'),
  (gen_random_uuid(), 'dddddddd-0000-0000-0000-000000000001', 4, 'El Pulso: que opino la comunidad.')
on conflict (publicacion_instagram_id, orden) do nothing;

-- Publicacion twitter (edicion 1) + algunos hilos
insert into public.publicacion_twitter (id, edicion_id, estado, published_manual_at)
values ('eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'published_manual', '2026-06-02 22:10:00-03')
on conflict (edicion_id) do nothing;

insert into public.hilos_twitter (id, publicacion_twitter_id, orden, texto)
values
  (gen_random_uuid(), 'eeeeeeee-0000-0000-0000-000000000001', 1, 'HILO | Equilibrio ciego: el resumen politico del 02/06 en La Puta Politica.'),
  (gen_random_uuid(), 'eeeeeeee-0000-0000-0000-000000000001', 2, '1/ El Congreso debatio el nuevo presupuesto con posiciones marcadas entre los bloques.'),
  (gen_random_uuid(), 'eeeeeeee-0000-0000-0000-000000000001', 3, '2/ Tension cambiaria: el mercado reacciono con cautela a los anuncios.'),
  (gen_random_uuid(), 'eeeeeeee-0000-0000-0000-000000000001', 4, '3/ Las provincias reclaman una revision de la coparticipacion.')
on conflict (publicacion_twitter_id, orden) do nothing;

-- Clima diario
insert into public.clima_diario (id, edicion_id, provincia, fecha, temperatura_min, temperatura_max, condicion, icono)
values
  (gen_random_uuid(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Buenos Aires', '2026-06-02', 8, 15, 'Parcialmente nublado', 'cloud'),
  (gen_random_uuid(), 'aaaaaaaa-0000-0000-0000-000000000002', 'Buenos Aires', '2026-06-03', 7, 14, 'Despejado', 'sun')
on conflict (edicion_id, provincia, fecha) do nothing;

-- Postulaciones (4 pending, 2 rejected)
insert into public.postulaciones (id, nombre, email, telefono, edad, provincia, motivacion, estado, revisada_en)
values
  ('ffffffff-0000-0000-0000-000000000001', 'Lucia Fernandez', 'lucia.fernandez@example.com', '+5491140000001', 27, 'Buenos Aires', 'Me interesa aportar miradas diversas sobre la actualidad.', 'pending', null),
  ('ffffffff-0000-0000-0000-000000000002', 'Mateo Gimenez', 'mateo.gimenez@example.com', '+5493510000002', 31, 'Cordoba', 'Quiero participar de un espacio de analisis colectivo.', 'pending', null),
  ('ffffffff-0000-0000-0000-000000000003', 'Sofia Romero', 'sofia.romero@example.com', '+5493410000003', 24, 'Santa Fe', 'Me gusta debatir politica con fundamentos.', 'pending', null),
  ('ffffffff-0000-0000-0000-000000000004', 'Tomas Acosta', 'tomas.acosta@example.com', '+5492610000004', 29, 'Mendoza', 'Busco un lugar serio para opinar.', 'pending', null),
  ('ffffffff-0000-0000-0000-000000000005', 'Valentina Diaz', 'valentina.diaz@example.com', '+5493870000005', 22, 'Salta', 'Me interesa el periodismo politico.', 'rejected', '2026-06-01 12:00:00-03'),
  ('ffffffff-0000-0000-0000-000000000006', 'Joaquin Ruiz', 'joaquin.ruiz@example.com', '+5492230000006', 35, 'Buenos Aires', 'Quiero sumar mi opinion.', 'rejected', '2026-06-01 12:00:00-03')
on conflict (id) do nothing;
