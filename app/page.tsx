import Image from "next/image";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">

      {/* Full-bleed photo */}
      <Image
        src="/images/IMG_6461.JPG"
        alt="KimDiane Rogers"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Layered gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(14, 11, 8, 0.10) 0%,
              rgba(14, 11, 8, 0.08) 40%,
              rgba(14, 11, 8, 0.55) 70%,
              rgba(14, 11, 8, 0.88) 100%
            )
          `,
        }}
      />

      {/* Subtle left vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(14, 11, 8, 0.35) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-10 pb-16 sm:px-16 sm:pb-20 md:px-24 md:pb-24">

        {/* Decorative rule */}
        <div
          className="mb-6 h-px w-16"
          style={{ background: "var(--teal)", opacity: 0.8 }}
        />

        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--font-cormorant-garamond)",
            fontWeight: 300,
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            color: "var(--foreground)",
          }}
        >
          KimDiane
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>Rogers</span>
        </h1>

        {/* Subtitle */}
        <h2
          className="mt-5"
          style={{
            fontFamily: "var(--font-cormorant-garamond)",
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 2vw, 1.35rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--stone)",
          }}
        >
          Author&nbsp;&nbsp;·&nbsp;&nbsp;Traveler&nbsp;&nbsp;·&nbsp;&nbsp;Adventurer
        </h2>

        {/* Coming Soon */}
        <div className="mt-8 flex items-center gap-4">
          <small
            style={{
              fontFamily: "var(--font-cormorant-garamond)",
              fontWeight: 400,
              fontSize: "clamp(0.7rem, 1.2vw, 0.85rem)",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "var(--teal)",
              opacity: 0.9,
            }}
          >
            Coming Soon
          </small>
          <div
            className="flex-1 h-px max-w-24"
            style={{ background: "var(--teal)", opacity: 0.35 }}
          />
        </div>

      </div>
    </main>
  );
}
