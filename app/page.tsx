import Image from "next/image";
import Link from "next/link";

import visualessLogo from "@/assets/logo/Logo.svg";
import sectionOneBackground from "@/assets/picture/Section1.png";

const navItems = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "/analyze", label: "Analyze" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#172236] text-white">
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <Image
          src={sectionOneBackground}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="relative z-20 flex w-full justify-center pt-5">
          <nav
            aria-label="Primary navigation"
            className="grid w-full max-w-[360px] grid-cols-3 items-center px-6 text-center font-[var(--font-instrument-serif)] text-[clamp(1.25rem,1.55vw,1.85rem)] leading-none text-white"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute inset-x-0 top-1/2 z-10 mx-auto flex w-full -translate-y-1/2 flex-col items-center px-6 text-center">
          <h1 className="max-w-xl text-balance text-[clamp(1.35rem,1.85vw,2.25rem)] font-medium leading-[0.98] tracking-normal text-white">
            &ldquo;A place where you can look into your own design
            imagination.&rdquo;
          </h1>
          <p className="mt-3 max-w-xl text-balance text-[clamp(0.78rem,0.88vw,0.95rem)] font-normal leading-[1.05] text-white">
            Visualess turns design references into style names, visual tags,
            color palettes, typography cues, and searchable keywords.
          </p>
          <Link
            href="/analyze"
            className="mt-20 font-[var(--font-instrument-serif)] text-[clamp(1.18rem,1.48vw,1.65rem)] leading-none text-white transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            start analyzing
          </Link>
        </div>

        <div className="pointer-events-none absolute bottom-[2vh] left-[2.5vw] z-10 w-[94.9vw] max-w-[1367px]">
          <Image
            src={visualessLogo}
            alt="Visualess"
            priority
            className="h-auto w-full"
            sizes="95vw"
          />
        </div>
      </section>

      <section
        id="about"
        className="bg-[#172236] px-6 py-24 text-center text-white"
      >
        <h2 className="mx-auto max-w-3xl text-4xl font-medium">
          From image to design language.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-normal leading-7 text-white/75">
          Upload a visual reference and let Visualess translate it into style
          taxonomy, mood, typography, palette, and research keywords.
        </p>
      </section>
    </main>
  );
}
