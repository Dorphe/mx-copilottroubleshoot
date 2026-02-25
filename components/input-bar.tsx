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
    <div className="bg-bg-primary shrink-0 flex flex-col gap-1 p-4 pb-2">
      <div className="border border-stroke-default rounded p-3 min-h-[44px] max-h-[120px] relative">
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
          className="w-full border-none outline-none resize-none text-[20px] leading-[30px] text-text-primary bg-transparent font-[inherit] min-h-[30px] max-h-[96px] p-0"
          rows={1}
        />
      </div>
      <div className="flex items-center justify-end">
        <button
          onClick={onSubmit}
          disabled={!canSend}
          className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded cursor-pointer disabled:cursor-default disabled:opacity-35 transition-opacity"
        >
          <Icon name="send" size={20} color="var(--color-text-informative)" />
        </button>
      </div>
      <div className="text-xs text-text-secondary text-center leading-[18px] px-4 py-0.5">
        Always validate AI generated content for accuracy.
      </div>
    </div>
  );
}
