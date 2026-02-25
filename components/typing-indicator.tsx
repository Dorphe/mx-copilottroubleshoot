import { CopilotOrb } from "./copilot-orb";

export function TypingIndicator() {
  return (
    <div className="px-4">
      <div className="flex items-center gap-1 mb-2">
        <CopilotOrb size={24} />
        <span className="text-base font-semibold text-text-primary">CoPilot</span>
      </div>
      <div className="flex gap-1 py-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-stroke-default"
            style={{
              animation: `typing-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
