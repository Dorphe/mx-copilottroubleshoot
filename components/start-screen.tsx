"use client";

import { SCENARIO } from "@/lib/scenario";
import { Chip, Avatar, MechanicalIcon, LibraryIcon, CopilotIcon } from "./pantry";

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
          <Avatar
            type="icon"
            icon={<MechanicalIcon />}
            entityType="thing"
            size="xs"
            color="blue"
          />
          <span className="text-[12px] text-text-secondary leading-3">
            {SCENARIO.asset.name} &mdash; {SCENARIO.asset.id}
          </span>
        </div>
      </div>

      {/* Section 2: Summary card */}
      <div className="w-full border border-stroke-default rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CopilotIcon size={24} />
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
          <Chip
            size="large"
            media={<MechanicalIcon />}
            onClick={() => onAction("troubleshoot")}
          >
            Troubleshoot asset
          </Chip>
          <Chip
            size="large"
            media={<LibraryIcon />}
            onClick={() => onAction("manual")}
          >
            Ask manual
          </Chip>
        </div>
      </div>
    </div>
  );
}
