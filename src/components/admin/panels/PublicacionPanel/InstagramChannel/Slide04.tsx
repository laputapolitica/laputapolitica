import { CopyButton, EditButton } from "../shared/ActionButtons";

export function InstagramSlide04() {
  const titulares = [
    "Pacto con el FMI",
    "Provincias en guerra",
    "Reformas en el Congreso",
    "Clima social en alerta",
  ];

  return (
    <div className="space-y-5">
      {titulares.map((titulo) => (
        <div key={titulo} className="flex items-start gap-2">
          <div className="inline-flex items-start rounded-[3.5px] border border-admin-ink bg-white px-2 py-1">
            <span
              className="font-ui text-sm font-medium text-admin-ink uppercase"
              style={{
                letterSpacing: "8px",
                maxWidth: "22ch",
                wordBreak: "keep-all",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {titulo}
            </span>
          </div>
          <EditButton />
          <CopyButton />
        </div>
      ))}
      <div className="flex items-center gap-2">
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
