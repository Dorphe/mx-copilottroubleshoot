"use client";

import { SCENARIO } from "@/lib/scenario";
import { Icon } from "./icons";

interface StartScreenProps {
  onAction: (action: string) => void;
}

export function StartScreen({ onAction }: StartScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-0 p-4 pb-0">
      {/* Work order card */}
      <div className="w-full border border-stroke-default rounded-lg p-4 flex flex-col gap-4">
        {/* WO number + title */}
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold text-text-secondary leading-5">
            WO #{SCENARIO.wo.number}
          </span>
          <span className="text-[20px] font-semibold text-text-primary leading-7">
            {SCENARIO.wo.title}
          </span>
        </div>

        {/* Asset row */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border border-stroke-default flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            <Icon name="mechanical" size={16} color="rgba(255,255,255,0.9)" />
          </div>
          <span className="text-[14px] text-text-secondary leading-5">
            {SCENARIO.asset.name} &mdash; {SCENARIO.asset.id}
          </span>
        </div>

        {/* Description */}
        <div className="text-[16px] leading-[24px] text-text-primary flex flex-col gap-4">
          <p className="m-0">{SCENARIO.wo.description}</p>
          <p className="m-0">{SCENARIO.wo.history}</p>
        </div>

        {/* Get started section */}
        <div className="flex flex-col gap-2 pt-4">
          <span className="text-[14px] font-semibold text-text-secondary leading-5">
            Get started
          </span>
          <div className="flex flex-wrap gap-2">
            <ActionChip
              icon="mechanical"
              label="Troubleshoot asset"
              onClick={() => onAction("troubleshoot")}
            />
            <ActionChip
              icon="library"
              label="Ask manual"
              onClick={() => onAction("manual")}
            />
            <ActionChip
              icon="workOrder"
              label="Get work history summary"
              onClick={() => onAction("history")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionChip({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-bg-primary-accent border-none rounded-full cursor-pointer shrink-0 hover:bg-bg-expressive-blue transition-colors"
    >
      <div className="w-7 h-7 rounded-full bg-bg-expressive-blue flex items-center justify-center shrink-0">
        <Icon name={icon} size={18} color="var(--color-text-informative)" />
      </div>
      <span className="text-[14px] font-bold text-text-informative leading-5 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
