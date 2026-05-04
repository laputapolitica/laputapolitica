import { EditableTitle } from "../shared/EditableTitle";
import { DownloadButton } from "../shared/ActionButtons";

export function PortadaSlide() {
  return (
    <div className="space-y-4">
      <EditableTitle value="Equilibrio ciego" />
      <div>
        <p className="mb-2 font-ui text-xs font-semibold tracking-wider text-text-secondary">
          PORTADA
        </p>
        <div className="flex items-start gap-4">
          <div className="h-[200px] w-[200px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
          <DownloadButton />
        </div>
      </div>
    </div>
  );
}
