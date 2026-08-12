import { ElPulsoLogo, Logo } from "@/components/shared";

export function HeaderElPulso(): React.ReactElement {
  return (
    <>
      <div className="flex items-center gap-3">
        <Logo variant="small" className="h-[30px] w-auto" />
        <span aria-hidden="true" className="h-6 w-px bg-border-default" />
        <ElPulsoLogo className="h-[22px] w-auto" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cockades/ar.svg" alt="Argentina" className="h-[26px] w-[26px]" />
    </>
  );
}
