import { CopilotOrb } from "./copilot-orb";
import { MarkdownRenderer } from "./markdown-renderer";

interface CopilotMessageProps {
  children?: React.ReactNode;
  text?: string;
}

export function CopilotMessage({ children, text }: CopilotMessageProps) {
  return (
    <div className="flex flex-col gap-2 px-4 animate-[fade-in-up_0.3s_ease]">
      <div className="flex items-center gap-1">
        <CopilotOrb size={24} />
        <span className="text-[12px] font-semibold text-text-primary leading-[18px]">
          CoPilot
        </span>
      </div>
      <div className="text-[16px] leading-[24px] text-text-primary">
        {text ? <MarkdownRenderer content={text} /> : children}
      </div>
    </div>
  );
}
