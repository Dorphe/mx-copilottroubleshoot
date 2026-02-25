import { Icon } from "./icons";
import { SCENARIO } from "@/lib/scenario";

interface SessionSummaryProps {
  stepsAttempted: string[];
  outcome: string;
  recommendation?: string;
  issue?: string;
}

export function SessionSummary({
  stepsAttempted,
  outcome,
  recommendation,
  issue,
}: SessionSummaryProps) {
  return (
    <div className="px-4 animate-[fade-in-up_0.3s_ease]">
      <div className="bg-bg-primary rounded-lg border border-stroke-default p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon name="check" size={20} color="var(--color-text-positive)" />
          <span className="text-[14px] font-semibold text-text-primary leading-5">
            Troubleshooting complete
          </span>
        </div>

        {recommendation && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-text-secondary leading-5">
              Recommendation
            </span>
            <span className="text-[16px] leading-[24px] text-text-primary">
              {recommendation}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-text-secondary leading-5">
            Resolution
          </span>
          <span className="text-[16px] leading-[24px] text-text-primary">
            {outcome}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-text-secondary leading-5">
            Steps attempted
          </span>
          <span className="text-[16px] leading-[24px] text-text-primary">
            {(stepsAttempted || []).join(" → ")}
          </span>
        </div>

        {issue && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-text-secondary leading-5">
              Issue
            </span>
            <span className="text-[16px] leading-[24px] text-text-primary">
              {issue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
