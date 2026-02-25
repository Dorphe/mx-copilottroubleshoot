import { CopilotOrb } from "./copilot-orb";
import { Icon } from "./icons";
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
          <CopilotOrb size={24} />
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

      {/* Right: action buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        {/* Library / knowledge base button with badge */}
        <button className="relative w-10 h-10 flex items-center justify-center bg-transparent border-none rounded-lg cursor-pointer hover:bg-bg-secondary transition-colors">
          <Icon name="library" size={20} color="var(--color-icon-secondary)" />
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-bg-feedback-negative rounded-full flex items-center justify-center text-[10px] font-bold text-white leading-none px-1">
            3
          </span>
        </button>

        {/* Help / question button */}
        <button className="w-10 h-10 flex items-center justify-center bg-transparent border-none rounded-lg cursor-pointer hover:bg-bg-secondary transition-colors">
          <Icon name="question" size={20} color="var(--color-icon-secondary)" />
        </button>

        {/* Collapse / close panel button */}
        <button
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center bg-transparent border-none rounded-lg cursor-pointer hover:bg-bg-secondary transition-colors"
        >
          <Icon name="sidebar-right" size={20} color="var(--color-icon-secondary)" />
        </button>
      </div>
    </div>
  );
}
