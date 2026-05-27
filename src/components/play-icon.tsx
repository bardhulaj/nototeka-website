import type { SVGProps } from "react";

/**
 * Outlined play button (triangle inside a hollow stroke).
 * Source: noun-play-button-8037951.svg — "Play Button" by Meko / Noun Project.
 */
export function PlayIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="m32.691 13.961c-7.3594-4.2422-16.703 1.1523-16.703 9.6406v52.781c0 8.4922 9.3438 13.883 16.703 9.6445l45.789-26.391c7.3555-4.2422 7.3555-15.02 0-19.262zm-9.5977 2.6758c2.3281-1.3438 5.3477-1.5117 8.0508 0.046875l45.789 26.391c5.4023 3.1133 5.4023 10.727 0 13.84l-45.789 26.414c-5.4062 3.1172-12.02-0.71094-12.02-6.9453v-52.781c0-3.1172 1.6406-5.625 3.9688-6.9648z" />
    </svg>
  );
}
