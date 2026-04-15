// Permanent inline SVG icon components — no expiring URLs

// ── Sidebar icons (white on green bg) ────────────────────────────────────────

export function IconSettings({ size = 20, color = "white", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10.0007 12.5C11.3814 12.5 12.5007 11.3808 12.5007 10C12.5007 8.61933 11.3814 7.50004 10.0007 7.50004C8.61994 7.50004 7.50065 8.61933 7.50065 10C7.50065 11.3808 8.61994 12.5 10.0007 12.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.1673 12.5C16.0564 12.7514 16.0233 13.0302 16.0723 13.3005C16.1213 13.5709 16.2502 13.8203 16.4423 14.0167L16.4923 14.0667C16.6473 14.2215 16.7702 14.4053 16.8541 14.6076C16.938 14.81 16.9811 15.0268 16.9811 15.2459C16.9811 15.4649 16.938 15.6818 16.8541 15.8841C16.7702 16.0864 16.6473 16.2702 16.4923 16.425C16.3375 16.58 16.1537 16.7029 15.9514 16.7868C15.7491 16.8707 15.5322 16.9139 15.3131 16.9139C15.0941 16.9139 14.8772 16.8707 14.6749 16.7868C14.4726 16.7029 14.2888 16.58 14.134 16.425L14.084 16.375C13.8876 16.1829 13.6381 16.0541 13.3678 16.005C13.0975 15.956 12.8187 15.9891 12.5673 16.1C12.3208 16.2057 12.1106 16.3811 11.9626 16.6047C11.8145 16.8282 11.7351 17.0902 11.734 17.3584V17.5C11.734 17.9421 11.5584 18.366 11.2458 18.6786C10.9333 18.9911 10.5093 19.1667 10.0673 19.1667C9.62529 19.1667 9.20137 18.9911 8.88881 18.6786C8.57625 18.366 8.40065 17.9421 8.40065 17.5V17.425C8.3942 17.1492 8.30492 16.8817 8.14441 16.6573C7.9839 16.4329 7.7596 16.2619 7.50065 16.1667C7.2493 16.0558 6.97049 16.0227 6.70016 16.0717C6.42983 16.1207 6.18038 16.2496 5.98398 16.4417L5.93398 16.4917C5.7792 16.6467 5.59538 16.7696 5.39305 16.8535C5.19072 16.9373 4.97384 16.9805 4.75482 16.9805C4.53579 16.9805 4.31891 16.9373 4.11658 16.8535C3.91425 16.7696 3.73044 16.6467 3.57565 16.4917C3.42069 16.3369 3.29776 16.1531 3.21388 15.9508C3.13001 15.7484 3.08684 15.5316 3.08684 15.3125C3.08684 15.0935 3.13001 14.8766 3.21388 14.6743C3.29776 14.472 3.42069 14.2882 3.57565 14.1334L3.62565 14.0834C3.81776 13.887 3.94664 13.6375 3.99565 13.3672C4.04467 13.0969 4.01158 12.8181 3.90065 12.5667C3.79501 12.3202 3.61961 12.11 3.39604 11.962C3.17246 11.8139 2.91047 11.7344 2.64232 11.7334H2.50065C2.05862 11.7334 1.6347 11.5578 1.32214 11.2452C1.00958 10.9327 0.833984 10.5087 0.833984 10.0667C0.833984 9.62468 1.00958 9.20076 1.32214 8.8882C1.6347 8.57564 2.05862 8.40004 2.50065 8.40004H2.57565C2.85148 8.39359 3.11899 8.30431 3.3434 8.1438C3.56781 7.98329 3.73875 7.75899 3.83398 7.50004C3.94491 7.24869 3.978 6.96988 3.92899 6.69955C3.87997 6.42922 3.7511 6.17977 3.55898 5.98337L3.50898 5.93337C3.35402 5.77859 3.23109 5.59477 3.14722 5.39244C3.06334 5.19011 3.02017 4.97323 3.02017 4.75421C3.02017 4.53518 3.06334 4.3183 3.14722 4.11597C3.23109 3.91364 3.35402 3.72983 3.50898 3.57504C3.66377 3.42008 3.84759 3.29715 4.04992 3.21327C4.25225 3.1294 4.46912 3.08623 4.68815 3.08623C4.90718 3.08623 5.12405 3.1294 5.32638 3.21327C5.52871 3.29715 5.71253 3.42008 5.86732 3.57504L5.91732 3.62504C6.11372 3.81715 6.36316 3.94603 6.63349 3.99504C6.90382 4.04406 7.18264 4.01097 7.43398 3.90004H7.50065C7.74712 3.7944 7.95733 3.619 8.10539 3.39543C8.25346 3.17185 8.33291 2.90986 8.33398 2.64171V2.50004C8.33398 2.05801 8.50958 1.63409 8.82214 1.32153C9.1347 1.00897 9.55862 0.833374 10.0007 0.833374C10.4427 0.833374 10.8666 1.00897 11.1792 1.32153C11.4917 1.63409 11.6673 2.05801 11.6673 2.50004V2.57504C11.6684 2.8432 11.7478 3.10519 11.8959 3.32876C12.044 3.55234 12.2542 3.72774 12.5007 3.83337C12.752 3.9443 13.0308 3.97739 13.3011 3.92838C13.5715 3.87936 13.8209 3.75049 14.0173 3.55837L14.0673 3.50837C14.2221 3.35341 14.4059 3.23048 14.6082 3.14661C14.8106 3.06273 15.0275 3.01956 15.2465 3.01956C15.4655 3.01956 15.6824 3.06273 15.8847 3.14661C16.087 3.23048 16.2709 3.35341 16.4256 3.50837C16.5806 3.66316 16.7035 3.84698 16.7874 4.04931C16.8713 4.25164 16.9145 4.46851 16.9145 4.68754C16.9145 4.90657 16.8713 5.12344 16.7874 5.32577C16.7035 5.5281 16.5806 5.71192 16.4256 5.86671L16.3756 5.91671C16.1835 6.11311 16.0547 6.36255 16.0056 6.63288C15.9566 6.90321 15.9897 7.18203 16.1006 7.43337V7.50004C16.2063 7.74651 16.3817 7.95672 16.6053 8.10478C16.8288 8.25285 17.0908 8.3323 17.359 8.33337H17.5006C17.9427 8.33337 18.3666 8.50897 18.6792 8.82153C18.9917 9.13409 19.1673 9.55801 19.1673 10C19.1673 10.4421 18.9917 10.866 18.6792 11.1786C18.3666 11.4911 17.9427 11.6667 17.5006 11.6667H17.4256C17.1575 11.6678 16.8955 11.7472 16.6719 11.8953C16.4484 12.0434 16.273 12.2536 16.1673 12.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLogout({ size = 20, color = "white", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M7.5 3.5H4.167A1.667 1.667 0 0 0 2.5 5.167v9.666A1.667 1.667 0 0 0 4.167 16.5H7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.333 14.167 17.5 10l-4.167-4.167" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 10H7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronLeft({ size = 27, color = "#2d7a45", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 27 27" fill="none" className={className}>
      <path d="M16.5 6.75L9.75 13.5l6.75 6.75" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight({ size = 27, color = "#2d7a45", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 27 27" fill="none" className={className}>
      <path d="M10.5 6.75L17.25 13.5l-6.75 6.75" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Dashboard stat card icons (green) ────────────────────────────────────────

export function IconDollar({ size = 28, color = "#666666", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M14 2.33319V25.6665" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.8333 5.83319H11.0833C10.0004 5.83319 8.96175 6.2634 8.19598 7.02917C7.43021 7.79495 7 8.83356 7 9.91652C7 10.9995 7.43021 12.0381 8.19598 12.8039C8.96175 13.5697 10.0004 13.9999 11.0833 13.9999H16.9167C17.9996 13.9999 19.0382 14.4301 19.804 15.1958C20.5698 15.9616 21 17.0002 21 18.0832C21 19.1662 20.5698 20.2048 19.804 20.9705C19.0382 21.7363 17.9996 22.1665 16.9167 22.1665H7" stroke={color} strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPeople({ size = 28, color = "#666666", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M18.6673 24.5V22.1667C18.6673 20.929 18.1757 19.742 17.3005 18.8668C16.4253 17.9917 15.2383 17.5 14.0007 17.5H7.00065C5.76297 17.5 4.57599 17.9917 3.70082 18.8668C2.82565 19.742 2.33398 20.929 2.33398 22.1667V24.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.666 3.64935C19.6667 3.90878 20.553 4.49316 21.1856 5.31076C21.8183 6.12836 22.1616 7.13289 22.1616 8.16669C22.1616 9.20048 21.8183 10.205 21.1856 11.0226C20.553 11.8402 19.6667 12.4246 18.666 12.684" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25.666 24.5V22.1667C25.6652 21.1327 25.3211 20.1282 24.6876 19.311C24.0541 18.4938 23.1672 17.9102 22.166 17.6517" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5007 12.8333C13.078 12.8333 15.1673 10.744 15.1673 8.16667C15.1673 5.58934 13.078 3.5 10.5007 3.5C7.92332 3.5 5.83398 5.58934 5.83398 8.16667C5.83398 10.744 7.92332 12.8333 10.5007 12.8333Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrendingUp({ size = 28, color = "#666666", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M18.668 8.16669H25.668V15.1667" stroke={color} strokeWidth="1.4359" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25.6654 8.16669L15.7487 18.0834L9.91537 12.25L2.33203 19.8334" stroke={color} strokeWidth="1.4359" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Link / action icons ───────────────────────────────────────────────────────

export function IconArrowSquareOut({ size = 24, color = "#0288d1", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M10.5 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3h7m0 0v7M21 3l-9 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconExternalLink({ size = 16, color = "white", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6.5 3H3a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 3 15h9a1.5 1.5 0 0 0 1.5-1.5V10" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M9.5 1.5h5m0 0V6.5M14.5 1.5 7.5 8.5" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconExternalLinkBox({ size = 16, color = "#123a1e", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6.667 3.333H3.333C2.597 3.333 2 3.93 2 4.667v8c0 .736.597 1.333 1.333 1.333h8c.736 0 1.333-.597 1.333-1.333V9.333" stroke={color} strokeWidth="1.333" strokeLinecap="round" />
      <path d="M10 2h4m0 0v4M14 2L7.333 8.667" stroke={color} strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCaretDown({ size = 24, color = "currentColor", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose({ size = 24, color = "currentColor", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Application form icons ────────────────────────────────────────────────────

export function IconUpload({ size = 24, color = "#2d7a45", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 17v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15V3m0 0L8.5 6.5M12 3l3.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconErrorOutline({ size = 22, color = "#d32f2f", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" className={className}>
      <circle cx="11" cy="11" r="9.5" stroke={color} strokeWidth="1.5" />
      <path d="M11 7v4.5" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="11" cy="14.5" r="1" fill={color} />
    </svg>
  );
}

export function IconPencil({ size = 18, color = "#d32f2f", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M13.5 2.25a1.591 1.591 0 0 1 2.25 2.25L5.625 14.625l-3 .75.75-3L13.5 2.25Z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLegendStroke({ width = 20, color = "#00a87e", className }: { width?: number; color?: string; className?: string }) {
  return (
    <svg width={width} height="4" viewBox={`0 0 ${width} 4`} fill="none" className={className}>
      <line x1="0" y1="2" x2={width} y2="2" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ── Avatar placeholder ────────────────────────────────────────────────────────

export function AvatarPlaceholder({ size = 60, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="30" r="30" fill="white" />
      <circle cx="30" cy="30" r="15.5" stroke="#56BD60" strokeWidth="2.4" />
      <path d="M38.75 24.394c0-4.196-3.366-7.602-7.519-7.602-4.151 0-7.518 3.406-7.518 7.602 0 4.195 3.367 7.601 7.518 7.601 1.666 0 3.205-.548 4.453-1.474l3.066.867-.892-3.014a7.664 7.664 0 0 0 .892-3.98Z" stroke="#56BD60" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M28.864 28.099c.682 1.313 1.858 2.041 3.529 2.184 1.671.144 3.152-.401 4.442-1.634" stroke="#56BD60" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M27.666 20.958c-.24 1.363.02 2.66.781 3.893.762 1.234 1.85 2.065 3.265 2.493" stroke="#56BD60" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// ── Step dot for progress timeline ───────────────────────────────────────────

type DotState = "current" | "completed" | "error" | "not-yet";

export function StepDot({ state, size = 12, className }: { state: DotState; size?: number; className?: string }) {
  if (state === "completed") {
    // Green filled circle, no checkmark
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
        <circle cx="6" cy="6" r="6" fill="#56BD60" />
      </svg>
    );
  }
  if (state === "current") {
    // Same green hollow circle with thicker border
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
        <circle cx="6" cy="6" r="5" stroke="#56BD60" strokeWidth="2" fill="white" />
      </svg>
    );
  }
  if (state === "error") {
    // Red hollow circle
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
        <circle cx="6" cy="6" r="5" stroke="#d32f2f" strokeWidth="2" fill="white" />
      </svg>
    );
  }
  // not-yet: gray hollow circle
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
      <circle cx="6" cy="6" r="5" stroke="#bdbdbd" strokeWidth="1.5" fill="white" />
    </svg>
  );
}

export function getDotState(i: number, step: number, validations: ("ok" | "error" | "unvisited")[]): DotState {
  if (i === step) return "current";
  if (i > step) return "not-yet";
  return validations[i] === "ok" ? "completed" : "error";
}
