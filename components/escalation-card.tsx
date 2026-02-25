interface EscalationCardProps {
  expertName: string;
  expertTitle: string;
  availability: string;
  reason: string;
}

export function EscalationCard({
  expertName,
  expertTitle,
  availability,
  reason,
}: EscalationCardProps) {
  const initials = expertName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="px-4 animate-[fade-in-up_0.3s_ease]">
      <div className="bg-bg-primary-accent rounded-lg p-4 flex flex-col gap-3">
        <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Recommended specialist
        </div>
        <div className="text-[16px] leading-[24px] text-text-primary">{reason}</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-expressive-blue flex items-center justify-center shrink-0">
            <span className="text-base font-semibold text-text-informative">
              {initials}
            </span>
          </div>
          <div>
            <div className="text-base font-semibold text-text-primary leading-6">
              {expertName}
            </div>
            <div className="text-sm text-text-secondary leading-5">
              {expertTitle} &middot; {availability}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
