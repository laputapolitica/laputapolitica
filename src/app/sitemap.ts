import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { LEGAL, LEGAL_DOCUMENTS } from "@/lib/legal";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PublishedEdition = {
  fecha: string;
  publicada_en: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const supabase = await createClient();
  const editions: PublishedEdition[] = [];
  const pageSize = 1000;

  // Paginate so the API row limit cannot truncate the published archive.
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("ediciones")
      .select("fecha, publicada_en")
      .eq("estado", "published")
      .order("publicada_en", { ascending: false, nullsFirst: false })
      .order("fecha", { ascending: true })
      .range(offset, offset + pageSize - 1)
      .returns<PublishedEdition[]>();

    if (error) {
      throw new Error(`Error generando sitemap: ${error.message}`);
    }

    if (!data?.length) break;
    editions.push(...data);
    offset += data.length;
  }

  return [
    {
      url: new URL("/", siteUrl).href,
      lastModified: editions[0]?.publicada_en ?? undefined,
    },
    ...Object.values(LEGAL_DOCUMENTS).map((document) => ({
      url: new URL(document.href, siteUrl).href,
      lastModified: LEGAL.lastUpdated,
      priority: 0.2,
    })),
    {
      url: new URL("/info", siteUrl).href,
      priority: 0.8,
    },
    ...editions.map((edition) => ({
      // Share links use the database slug verbatim: dd-mm-yyyy.
      url: new URL(`/edicion/${edition.fecha}`, siteUrl).href,
      lastModified: edition.publicada_en ?? undefined,
    })),
  ];
}
