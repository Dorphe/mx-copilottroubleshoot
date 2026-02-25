"use client";

import { Icon } from "./icons";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function InputBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask CoPilot",
  isLoading = false,
}: InputBarProps) {
  const canSend = value.trim() && !isLoading;

  return (
    <div className="bg-bg-primary shrink-0 flex flex-col gap-1 px-4 pt-2 pb-2">
      <div className="border border-stroke-default rounded-lg p-3 min-h-[44px] max-h-[120px] relative flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) onSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 border-none outline-none resize-none text-[16px] leading-[24px] text-text-primary bg-transparent font-[inherit] min-h-[24px] max-h-[96px] p-0"
          rows={1}
        />
        <button
          onClick={onSubmit}
          disabled={!canSend}
          className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded cursor-pointer shrink-0 disabled:cursor-default disabled:opacity-35 transition-opacity"
        >
          <Icon name="send" size={20} color="var(--color-text-informative)" />
        </button>
      </div>
      <div className="text-[11px] text-text-secondary text-center leading-[16px] px-4 py-0.5">
        Always validate AI generated content for accuracy.
      </div>
    </div>
  );
}
