import { DESKTOP_ICONS } from "@/constants/desktop";

export function DesktopIcons() {
  return (
    <section
      aria-label="Desktop files"
      className="absolute right-3 top-14 z-10 hidden flex-col items-center gap-4 sm:flex"
    >
      {DESKTOP_ICONS.map(({ label, icon: Icon, accent }) => (
        <figure key={label} className="flex w-20 flex-col items-center gap-1.5">
          <span
            className="grid size-12 place-items-center border-2 border-plum shadow-pixel"
            style={{ backgroundColor: accent }}
          >
            <Icon aria-hidden="true" className="size-6 text-plum" strokeWidth={2.5} />
          </span>
          <figcaption className="max-w-full truncate rounded-none bg-plum/70 px-1.5 py-0.5 font-mono text-[9px] text-cream backdrop-blur-sm">
            {label}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
