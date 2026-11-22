import MapExplorer from "@/components/MapExplorer";
import { DATASET } from "@/lib/zones";

export default function HomePage() {
  return <MapExplorer dataset={DATASET} />;
}
