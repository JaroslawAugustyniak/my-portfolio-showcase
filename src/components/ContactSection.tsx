import { Mail, Linkedin } from "lucide-react";

const ContactSection = () => (
  <section className="py-16 md:py-24" id="contact">
    <div className="container max-w-4xl">
      <p className="text-meta mb-8">{"{ Kontakt }"}</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl card-shadow bg-card">
          <p className="text-meta text-[10px] mb-3">{"{NAME}"}</p>
          <p className="font-display text-lg font-semibold text-foreground">
            Jarosław Augustyniak
          </p>
        </div>

        <div className="p-6 rounded-xl card-shadow bg-card">
          <p className="text-meta text-[10px] mb-3">{"{LINKS}"}</p>
          <div className="flex flex-col gap-3">
            <a
              href="https://useme.com/pl/roles/contractor/jareka,568577/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-smooth font-mono"
            >
              useme.com
            </a>
            <a
              href="https://www.linkedin.com/in/jaroslaw-augustyniak-864a01a8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth font-mono"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>

        <div className="p-6 rounded-xl card-shadow bg-card">
          <p className="text-meta text-[10px] mb-3">{"{EMAIL}"}</p>
          <a
            href="mailto:jar.augustyniak@gmail.com"
            className="inline-flex items-center gap-2 font-display text-foreground hover:text-primary transition-smooth break-all"
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            jar.augustyniak@gmail.com
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
