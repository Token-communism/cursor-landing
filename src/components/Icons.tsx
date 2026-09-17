import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function icon(props: IconProps): IconProps {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    "aria-hidden": true,
    ...props,
  };
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path
        d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15.5h12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LaunchIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path
        d="M4.5 10.5v4h11v-4M10 4v8m0-8 3.25 3.25M10 4 6.75 7.25"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ImportIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <rect x="3.5" y="3.5" width="5.5" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="11" y="3.5" width="5.5" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.25 10h7.5m0 0-2-2m2 2-2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsageIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M4 14.5 8 9l3 3.5 5-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 16.5h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function LedgerIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M5 4.5h10v11H5z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.5 8h5M7.5 11h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function DesktopIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <rect x="3" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7 16h6M10 13v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
