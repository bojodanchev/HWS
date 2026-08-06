import type { Spec, SpecKey } from "@/types/catalog";

const SPEC_LABELS: Record<SpecKey, string> = {
  torque: "Torque",
  tubeDiameter: "Tube diameter",
  voltage: "Voltage",
  power: "Power",
  speed: "Speed",
  limitSwitch: "Limit switch",
  ipRating: "IP rating",
  frequency: "Frequency",
  channels: "Channels",
  maxDoorArea: "Max door area",
  maxGateWeight: "Max gate weight",
  cableLength: "Length / range",
  material: "Material",
  warrantyYears: "Warranty",
};

function formatSpec(spec: Spec): string {
  if (spec.key === "tubeDiameter") return `Ø${spec.value} mm`;
  if (spec.key === "warrantyYears") return `${spec.value} year${Number(spec.value) === 1 ? "" : "s"}`;
  return `${spec.value}${spec.unit ? ` ${spec.unit}` : ""}`;
}

export function SpecTable({ specs }: { specs: Spec[] }) {
  if (specs.length === 0) return null;
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {specs.map((s) => (
          <tr key={s.key} className="border-b border-line">
            <th scope="row" className="w-2/5 py-2.5 pr-4 text-left font-medium text-steel">
              {SPEC_LABELS[s.key]}
            </th>
            <td className="py-2.5 font-mono text-ink">{formatSpec(s)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
