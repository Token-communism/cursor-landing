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
