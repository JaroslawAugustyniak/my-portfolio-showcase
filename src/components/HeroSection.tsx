const HeroSection = () => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/15 blur-[100px]" />
    </div>
    <div className="container max-w-4xl relative">
      <p className="text-meta mb-4">Full-stack Web Developer</p>
      <h1 className="text-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
        {"{"}" __full <span className="text-gradient">stack web</span>{" "}
        <br className="hidden md:block" />
        developer "{"}"}
      </h1>
      <div className="flex items-center gap-3 mt-8">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--success))] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--success))]" />
        </span>
        <span className="text-sm text-muted-foreground">Dostępny do nowych projektów</span>
      </div>
    </div>
  </section>
);

export default HeroSection;
