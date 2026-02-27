import { CopilotIcon } from "./pantry";
import { SCENARIO } from "@/lib/scenario";

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <div className="flex items-center h-16 px-2 py-4 border-b border-stroke-default bg-bg-primary shrink-0">
      {/* Left: Orb + title */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <CopilotIcon size={24} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[16px] font-semibold text-text-primary leading-6">
            CoPilot
          </span>
          <span className="text-[12px] font-normal text-text-secondary leading-[18px] truncate">
            {SCENARIO.asset.name}
          </span>
        </div>
      </div>

      {/* Right: restart button */}
      <button
        onClick={onReset}
        className="px-3 py-1.5 bg-transparent border border-stroke-default rounded-lg cursor-pointer text-[13px] font-semibold text-text-secondary leading-5 hover:bg-bg-secondary transition-colors"
      >
        Restart
      </button>
    </div>
  );
}
