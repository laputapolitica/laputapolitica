"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Noticia } from "./NoticiaCard";

type NoticiaModalProps = {
  noticias: Noticia[];
  onClose?: () => void;
};

function formatNewsNumber(orden: number) {
  return String(orden).padStart(2, "0");
}

function getOrderFromParam(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function NoticiaModal({ noticias, onClose }: NoticiaModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeOrder = getOrderFromParam(searchParams.get("n"));
  const noticia = noticias.find((item) => item.orden === activeOrder);
  const isOpen = Boolean(noticia);

  const handleClose = useCallback(() => {
    router.push(pathname, { scroll: false });
    onClose?.();
  }, [onClose, pathname, router]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="left-0 top-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 p-5 md:left-1/2 md:top-1/2 md:h-auto md:max-h-[90vh] md:w-[min(700px,calc(100vw-48px))] md:max-w-[700px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-lg md:border md:border-border-default md:p-8">
        {noticia ? (
          <>
            <DialogHeader className="gap-4">
              <div className="inline-flex w-fit rounded-full bg-primary px-3 py-1.5 font-ui text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                NOTICIA {formatNewsNumber(noticia.orden)}
              </div>
              <DialogTitle className="font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">
                {noticia.titulo}
              </DialogTitle>
            </DialogHeader>

            <div className="font-editorial text-base leading-[1.7] text-text-primary">
              {noticia.cuerpo}
            </div>

            {noticia.fuentes_urls.length > 0 ? (
              <section className="space-y-3">
                <h3 className="font-ui text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Fuentes
                </h3>
                <ul className="space-y-2">
                  {noticia.fuentes_urls.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="break-words font-ui text-sm text-text-primary underline underline-offset-4"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <DialogFooter>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center border border-primary px-4 py-2 font-ui text-sm font-medium text-text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Cerrar
              </button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export type { NoticiaModalProps };
