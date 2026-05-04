import type { MockOpinador } from "../types";
import { ElPulsoListView } from "./ListView";
import { ElPulsoDetailView } from "./DetailView";

export function ElPulsoChannel({
  selectedOpinador,
  noticiaIndex,
  onSelect,
}: {
  selectedOpinador: MockOpinador | null;
  noticiaIndex: number;
  onSelect: (opinador: MockOpinador) => void;
}) {
  if (selectedOpinador) {
    return <ElPulsoDetailView opinador={selectedOpinador} noticiaIndex={noticiaIndex} />;
  }

  return <ElPulsoListView onSelect={onSelect} />;
}
