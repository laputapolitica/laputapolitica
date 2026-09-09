import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "La Puta Política — La actualidad política argentina, clara y sin vueltas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [font, stylesheet] = await Promise.all([
    readFile(join(process.cwd(), "src/app/fonts/PlayfairDisplay-Bold.ttf")),
    readFile(join(process.cwd(), "src/app/globals.css"), "utf8"),
  ]);

  // ImageResponse cannot resolve CSS variables; read the existing brand tokens.
  function colorToken(name: string): string {
    const value = stylesheet.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]+)\\s*;`))?.[1];
    if (!value) throw new Error(`Missing OG color token: ${name}`);
    return value;
  }

  const ink = colorToken("text-primary");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: colorToken("bg-base"),
          color: ink,
          fontFamily: "Playfair Display",
          fontWeight: 700,
        }}
      >
        <div style={{ width: "100%", height: 3, backgroundColor: ink, marginBottom: 48 }} />
        <div style={{ fontSize: 94, lineHeight: 1.15, letterSpacing: "-3px" }}>
          La Puta Política
        </div>
        <div style={{ fontSize: 32, lineHeight: 1.5, marginTop: 28, maxWidth: 900 }}>
          La actualidad política argentina, clara y sin vueltas
        </div>
        <div style={{ width: "100%", height: 1, backgroundColor: ink, marginTop: 48 }} />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Playfair Display", data: font, weight: 700, style: "normal" }],
    },
  );
}
