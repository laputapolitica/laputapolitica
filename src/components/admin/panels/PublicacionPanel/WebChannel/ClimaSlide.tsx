import { EditButton } from "../shared/ActionButtons";
import { clima } from "../mocks";

export function ClimaSlide() {
  return (
    <div>
      <div className="relative inline-flex">
        <select className="h-[24px] appearance-none rounded-[4px] border border-admin-ink bg-white pl-2 pr-6 font-ui text-xs font-medium text-admin-ink outline-none cursor-pointer">
          <option>Buenos Aires</option>
          <option>Córdoba</option>
          <option>Santa Fe</option>
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-admin-ink text-[10px]">↓</span>
      </div>

      <div className="mt-4 flex gap-6 items-start">
        {clima.map((dia) => (
          <article key={dia.dia} className="flex flex-col gap-3">
            <div className="inline-flex w-fit h-[22px] items-center rounded-[3.5px] border border-admin-ink px-2">
              <span className="font-ui text-[11px] font-medium text-admin-ink whitespace-nowrap">{dia.dia}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-admin-ink bg-white p-2">
                <div className="h-[100px] w-[100px] rounded-[4px] bg-gray-200" />
              </div>
              <EditButton />
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] px-2 border" style={{ borderColor: "#2F4E85", color: "#2F4E85" }}>
                <span className="font-ui text-[11px] font-medium">Min</span>
              </div>
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-[11px] font-medium text-admin-ink">{dia.min}°</span>
              </div>
              <EditButton />
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] px-2 border" style={{ borderColor: "#B74A4A", color: "#B74A4A" }}>
                <span className="font-ui text-[11px] font-medium">Max</span>
              </div>
              <div className="inline-flex h-[22px] items-center rounded-[3.5px] border border-admin-ink bg-white px-2">
                <span className="font-ui text-[11px] font-medium text-admin-ink">{dia.max}°</span>
              </div>
              <EditButton />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
