import { CopyButton, EditButton } from "../shared/ActionButtons";

export function InstagramSlide01() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-sm font-medium text-admin-ink">
            Equilibrio ciego
          </span>
        </div>
        <EditButton />
        <CopyButton />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div className="h-[150px] w-[150px] shrink-0 rounded-lg border border-admin-ink bg-gray-200" />
        <CopyButton />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
          <span className="font-ui text-sm font-medium text-admin-ink">
            21 MAR 2026
          </span>
        </div>
        <EditButton />
        <CopyButton />
      </div>
    </div>
  );
}
