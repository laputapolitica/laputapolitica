import { IconInstagram, IconTwitter, IconWeb } from "@/components/admin/icons";
import type { Canal } from "../types";

export function CanalIcon({ canal }: { canal: Canal }) {
  const iconProps = { width: 14, height: 14 };

  if (canal === "web") {
    return <IconWeb {...iconProps} />;
  }

  if (canal === "instagram") {
    return <IconInstagram {...iconProps} />;
  }

  return <IconTwitter {...iconProps} />;
}
