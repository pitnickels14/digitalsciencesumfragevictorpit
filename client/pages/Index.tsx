import MouseGlow from "@/components/MouseGlow";
import Survey from "@/components/Survey";

export default function Index() {
  return (
    <main className="relative min-h-screen text-white">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,#001F3F_0%,#003366_100%)]" />

      {/* Mouse-follow glow */}
      <MouseGlow />

      <section className="relative z-20 container mx-auto px-6 py-10 md:py-16 flex flex-col items-center">
        <header className="w-full max-w-4xl mx-auto text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            PopMatch
          </h1>
          <p className="mt-3 md:mt-4 text-white/80 text-base md:text-lg">
            Finde deinen perfekten Pop-Artist in 60 Sekunden.
          </p>
        </header>

        <Survey />

        <footer className="mt-10 md:mt-14 text-center text-white/50 text-xs md:text-sm">
          © 2025 von Victor und Pit 5C2 LRSL
        </footer>
      </section>
    </main>
  );
}
