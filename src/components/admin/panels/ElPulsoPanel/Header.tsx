import { TabPrimary } from "@/components/admin/shared";

type HeaderItem = { id: string };

type HeaderProps = {
  noticias: HeaderItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function ElPulsoHeader({ noticias, activeIndex, onSelect }: HeaderProps) {
  return (
    <div className="flex gap-2 pb-4">
      {noticias.map((noticia, index) => (
        <TabPrimary
          key={noticia.id}
          isActive={index === activeIndex}
          onClick={() => onSelect(index)}
        >
          Noticia {String(index + 1).padStart(2, "0")}
        </TabPrimary>
      ))}
    </div>
  );
}
