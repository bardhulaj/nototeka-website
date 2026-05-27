import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderMediaProps = {
  icon: React.ReactNode;
  label?: string;
  ratio?: "square" | "portrait" | "video" | "wide";
  playable?: boolean;
  className?: string;
};

const ratioClass = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  video: "aspect-video",
  wide: "aspect-[16/10]",
};

export function PlaceholderMedia({
  icon,
  label,
  ratio = "square",
  playable = false,
  className,
}: PlaceholderMediaProps) {
  return (
    <div
      className={cn(
        "group/media relative flex items-center justify-center overflow-hidden rounded-xl bg-g1 ring-1 ring-inset ring-black/10 shadow-sm",
        ratioClass[ratio],
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3 text-g5">
        <span className="[&_svg]:size-12">{icon}</span>
        {label ? <span className="label-4-uc">{label}</span> : null}
      </div>

      {playable ? (
        <span
          aria-hidden
          className="absolute bottom-3 right-3 grid size-12 place-items-center rounded-full bg-g7 text-g1 shadow-md transition-transform duration-200 group-hover/media:scale-110"
        >
          <Play className="size-5 translate-x-px fill-current" />
        </span>
      ) : null}
    </div>
  );
}
