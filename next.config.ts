import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/terminos": ["./docs/legal/terminos-y-condiciones.md"],
    "/privacidad": ["./docs/legal/politica-de-privacidad.md"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eapsfpjahdbjypvxvutt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
