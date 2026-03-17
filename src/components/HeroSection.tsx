const HeroSection = () => (
  <section className="py-24 md:py-32">
    <div className="container max-w-4xl">
      <p className="text-meta mb-4">Full-stack Web Developer</p>
      <h1 className="text-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
        {"{"}" __full stack web{" "}
        <br className="hidden md:block" />
        developer "{"}"}
      </h1>
      <div className="flex items-center gap-3 mt-8">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-sm text-muted-foreground">Dostępny do nowych projektów</span>
      </div>
    </div>
  </section>
);

export default HeroSection;
