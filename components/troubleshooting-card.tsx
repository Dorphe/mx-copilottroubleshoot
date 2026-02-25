import { Icon } from "./icons";

interface TroubleshootingCardProps {
  recommendation: string;
  sources: string[];
}

export function TroubleshootingCard({
  recommendation,
  sources,
}: TroubleshootingCardProps) {
  return (
    <div className="px-4 animate-[fade-in-up_0.3s_ease]">
      <div className="bg-bg-primary border border-stroke-default rounded-lg p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Icon name="mechanical" size={24} color="var(--color-icon-secondary)" />
            <span className="text-base font-semibold text-text-primary leading-6">
              Recommended next steps
            </span>
          </div>
          <div className="text-[20px] leading-[30px] text-text-primary">
            {recommendation}
          </div>
        </div>
        {sources.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center pr-1">
              {sources.slice(0, 2).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full -mr-1 border border-stroke-default overflow-hidden flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    zIndex: 3 - i,
                  }}
                >
                  <Icon name="file" size={14} color="rgba(255,255,255,0.9)" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-semibold text-text-secondary leading-3">
              {sources[0]}
              {sources.length > 1 ? `, +${sources.length - 1}` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
