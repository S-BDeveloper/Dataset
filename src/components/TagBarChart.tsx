// src/components/TagBarChart.tsx
import TagTable from "./TagTable";
import type { IslamicFact } from "../types/Types";

export function TagBarChart({ data }: { data: IslamicFact[] }) {
  return <TagTable data={data} />;
}
