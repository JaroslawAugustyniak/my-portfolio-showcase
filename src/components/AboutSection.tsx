const AboutSection = () => (
  <section className="py-16 md:py-24" id="about">
    <div className="container">
      <p className="text-meta mb-8">{"{ O mnie }"}</p>
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <p className="text-body text-lg leading-relaxed">
            <strong className="text-foreground">Full-stack Developer</strong> z ponad{" "}
            <strong className="text-foreground">18-letnim doświadczeniem</strong> w budowaniu
            skalowalnych i wydajnych rozwiązań biznesowych. Specjalizuję się w całym cyklu
            tworzenia oprogramowania — od projektowania architektury po wdrożenie.
          </p>
          <p className="text-body text-lg leading-relaxed mt-4">
            Aktywnie integruję narzędzia AI w codziennej pracy, optymalizując procesy
            deweloperskie, automatyzując zadania i przyspieszając fazę prototypowania.
          </p>
          <p className="text-body text-lg leading-relaxed mt-4">
            Obecnie pełnię również rolę{" "}
            <strong className="text-foreground">Technology Consultant w Transfer Hub</strong>,
            gdzie doradzam strategicznie w zakresie wyboru technologii.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "18+", label: "Lat doświadczenia" },
            { value: "30+", label: "Zrealizowanych projektów" },
            { value: "Full-stack", label: "Front-end & Back-end" },
            { value: "AI", label: "Integracja narzędzi AI" },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-xl card-shadow bg-card">
              <p className="text-display text-2xl mb-1">{stat.value}</p>
              <p className="text-meta text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
