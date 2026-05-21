import { IconCopiar } from "@/components/admin/icons";
import { IconButton } from "@/components/admin/shared";
import { InstagramEditablePill } from "./shared";

export function InstagramSlide01() {
  return (
    <div>
      <InstagramEditablePill value="Equilibrio ciego" />

      <div className="mt-5 flex items-start gap-3">
        <div className="h-[150px] w-[150px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
        <IconButton>
          <IconCopiar width={12} height={12} />
          Copiar
        </IconButton>
      </div>

      <div className="mt-5">
        <InstagramEditablePill value="21 MAR 2026" />
      </div>
    </div>
  );
}
