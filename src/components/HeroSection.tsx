import { useState, useEffect } from "react";
import { getPosts, getPageBySlug } from '@/lib/api-switcher';
import { WordPressPost, WordPressPage } from "@/lib/wordpress.types";
import { useLanguage } from "@/context/LanguageContext";

const HeroSection = () => {
  const [page, setPage] = useState<WordPressPage | null>(null);
  const [dictionary, setDictionary] = useState<WordPressPost | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (!currentLanguage) return;
    getPageBySlug('strona-glowna', currentLanguage?.slug).then(setPage);
    getPosts('dictionary', {}, currentLanguage?.slug).then((posts) => setDictionary(posts[0]));
  }, [currentLanguage]);

  
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/15 blur-[100px]" />
      </div>
      <div className="container max-w-4xl relative">
        <p className="text-meta mb-4">{page?.acf?.subheader && page.acf.subheader}</p>
        <h1 className="text-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
          <div dangerouslySetInnerHTML={{ __html: page?.acf.header || '' }} />
        </h1>
        <div className="flex items-center gap-3 mt-8">
          {page?.acf?.ready_for_new_projects !== false ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--success))] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--success))]" />
            </span>
          ) : (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--danger))] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--danger))]" />
            </span>
          )}
          <span className="text-sm text-muted-foreground">{page?.acf?.ready_for_new_projects_label && page.acf.ready_for_new_projects_label}</span>
         
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
