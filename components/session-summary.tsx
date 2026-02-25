import { SCENARIO } from "@/lib/scenario";

interface SessionSummaryProps {
  stepsAttempted: string[];
  outcome: string;
}

export function SessionSummary({
  stepsAttempted,
  outcome,
}: SessionSummaryProps) {
  return (
    <div className="px-4 animate-[fade-in-up_0.3s_ease]">
      <div className="bg-bg-primary rounded-lg border border-stroke-default p-4">
        <div className="text-sm font-semibold text-text-secondary mb-2.5 uppercase tracking-wider">
          Session Summary &mdash; Auto-attached to WO #{SCENARIO.wo.number}
        </div>
        <div className="text-[16px] leading-[24px] text-text-primary">
          <strong>Steps attempted:</strong>{" "}
          {stepsAttempted.join(" \u2192 ")}
        </div>
        <div className="text-[16px] leading-[24px] text-text-primary mt-1">
          <strong>Outcome:</strong> {outcome}
        </div>
      </div>
    </div>
  );
}
