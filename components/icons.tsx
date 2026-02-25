interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const iconPaths: Record<string, (color: string) => React.ReactNode> = {
  close: (c) => (
    <path d="M18 6L6 18M6 6l12 12" stroke={c} strokeWidth="2" strokeLinecap="round" />
  ),
  mechanical: (c) => (
    <path
      d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
      stroke={c}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  library: (c) => (
    <>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={c} strokeWidth="1.5" fill="none" />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        stroke={c}
        strokeWidth="1.5"
        fill="none"
      />
    </>
  ),
  workOrder: (c) => (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M3 9h18M9 3v18" stroke={c} strokeWidth="1.5" />
    </>
  ),
  send: (c) => (
    <path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  check: (c) => (
    <path
      d="M20 6L9 17l-5-5"
      stroke={c}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "thumbs-up": (c) => (
    <path
      d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  "thumbs-down": (c) => (
    <path
      d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  file: (c) => (
    <>
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        stroke={c}
        strokeWidth="1.5"
        fill="none"
      />
      <polyline points="14 2 14 8 20 8" stroke={c} strokeWidth="1.5" fill="none" />
    </>
  ),
  user: (c) => (
    <>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={c} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="7" r="4" stroke={c} strokeWidth="1.5" fill="none" />
    </>
  ),
  question: (c) => (
    <>
      <circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="17" r="0.5" fill={c} stroke={c} strokeWidth="0.5" />
    </>
  ),
  "sidebar-right": (c) => (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M15 3v18" stroke={c} strokeWidth="1.5" />
    </>
  ),
  microphone: (c) => (
    <>
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="12" y1="19" x2="12" y2="23" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="23" x2="16" y2="23" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  image: (c) => (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={c} strokeWidth="1.5" fill="none" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M21 15l-5-5L5 21" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  sparkle: (c) => (
    <path
      d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

export function Icon({ name, size = 24, color = "var(--color-icon-secondary)" }: IconProps) {
  const render = iconPaths[name];
  if (!render) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
      {render(color)}
    </svg>
  );
}
