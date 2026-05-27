import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  bgImage?: string;
  tone?: "light" | "dark";
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

function titleCase(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function Section({
  id,
  bgImage,
  tone = "light",
  className,
  innerClassName,
  children,
}: SectionProps) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      aria-label={id ? titleCase(id) : undefined}
      className={cn(
        "relative isolate overflow-hidden",
        dark ? "text-g1" : "text-g7",
        className,
      )}
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {bgImage ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-black/10"
        />
      ) : null}
      <div className={cn("relative mx-auto w-full max-w-[1680px] px-6 py-20 sm:px-10 sm:py-24 md:py-28 lg:px-16 lg:py-32", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

type SectionEyebrowProps = {
  number: string;
  name: string;
  className?: string;
};

export function SectionEyebrow({ number, name, className }: SectionEyebrowProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="label-4-uc opacity-60">{number}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-30" />
      <span className="label-4-uc">{name}</span>
    </div>
  );
}
