import { CopyButton, EditButton } from "./ActionButtons";

export function StaticPillRow({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex h-[28px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
        <span className="whitespace-nowrap font-ui text-xs font-semibold text-admin-ink">
          {value}
        </span>
      </div>
      <EditButton />
      <CopyButton />
    </div>
  );
}
