"use client";

import { SCENARIO } from "@/lib/scenario";
import { Icon } from "./icons";

interface StartScreenProps {
  onAction: (action: string) => void;
}

export function StartScreen({ onAction }: StartScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 gap-16">
      {/* Section 1: Title + asset (no card) */}
      <div className="w-full flex flex-col gap-2">
        <div className="text-[20px] font-semibold text-text-primary leading-7">
          {SCENARIO.wo.title}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md border border-stroke-default flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #4a90d9, #3b7dd8)" }}
          >
            <Icon name="mechanical" size={14} color="rgba(255,255,255,0.9)" />
          </div>
          <span className="text-[12px] text-text-secondary leading-3">
            {SCENARIO.asset.name} &mdash; {SCENARIO.asset.id}
          </span>
        </div>
      </div>

      {/* Section 2: Summary card */}
      <div className="w-full border border-stroke-default rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon name="sparkle" size={24} color="var(--color-icon-secondary)" />
          <span className="text-[14px] font-semibold text-text-primary leading-5">
            Summary
          </span>
        </div>
        <ul className="text-[16px] leading-[24px] text-text-primary m-0 pl-6 flex flex-col gap-1">
          <li>{SCENARIO.wo.description}</li>
          <li>{SCENARIO.wo.history}</li>
        </ul>
      </div>

      {/* Section 3: Get started actions */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-[14px] font-semibold text-text-secondary leading-5">
          Get started
        </span>
        <div className="flex flex-col gap-2">
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
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stroke-default rounded-full cursor-pointer hover:bg-bg-secondary transition-colors w-fit"
    >
      <Icon name={icon} size={20} color="var(--color-icon-secondary)" />
      <span className="text-[14px] font-semibold text-text-primary leading-5 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
