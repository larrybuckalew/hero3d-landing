import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function RadarIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 12 19 5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3.2a8.8 8.8 0 1 0 8.8 8.8" />
      <path d="M12 7.4a4.6 4.6 0 1 0 4.6 4.6" />
    </svg>
  );
}

export function SparkIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M18.6 16.4l.7 2.2 2.2.7-2.2.7-.7 2.2-.7-2.2-2.2-.7 2.2-.7.7-2.2Z" />
    </svg>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l7 2.8v5.4c0 4.3-2.9 7.9-7 9.3-4.1-1.4-7-5-7-9.3V5.8L12 3Z" />
      <path d="m9 11.8 2.2 2.2L15.4 9.8" />
    </svg>
  );
}

export function LoopIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4.5 9.5A7.5 7.5 0 0 1 18 8.4" />
      <path d="M19.5 14.5A7.5 7.5 0 0 1 6 15.6" />
      <path d="M18.4 4.6v3.9h-3.9M5.6 19.4v-3.9h3.9" />
    </svg>
  );
}

export function BoltIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M13.2 3 5.8 13.4h5l-1.6 7.6 7.4-10.4h-5l1.6-7.6Z" />
    </svg>
  );
}

export function ArrowIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function MenuIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** Brand mark: three orbiting bodies around a core. */
export function LogoMark(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden {...p}>
      <defs>
        <linearGradient id="hm" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4f24a" />
          <stop offset="0.55" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="5.4" fill="url(#hm)" />
      <ellipse cx="16" cy="16" rx="14" ry="6.6" stroke="url(#hm)" strokeWidth="1.4" opacity="0.75" />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="6.6"
        stroke="url(#hm)"
        strokeWidth="1.4"
        opacity="0.45"
        transform="rotate(62 16 16)"
      />
      <circle cx="29" cy="13" r="2" fill="#c4f24a" />
      <circle cx="6" cy="21" r="1.5" fill="#22d3ee" />
    </svg>
  );
}

export const iconMap = {
  radar: RadarIcon,
  spark: SparkIcon,
  shield: ShieldIcon,
  loop: LoopIcon,
} as const;
