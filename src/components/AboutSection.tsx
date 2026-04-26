import { useState, useEffect } from "react";
import { getPostBySlug, getPageBySlug } from "@/lib/wordpress-api";
import { WordPressPost, WordPressPage } from "@/lib/wordpress.types";
import { useLanguage } from "@/context/LanguageContext"; 

const AboutSection = () => {
  const [page, setPage] = useState<WordPressPage | null>(null);
  const [post, setPost] = useState<WordPressPost | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (!currentLanguage) return;
    getPageBySlug('strona-glowna', currentLanguage.slug).then(setPage);
    getPostBySlug('o-mnie', 'section', currentLanguage.slug).then(setPost);
  }, [currentLanguage]);



  return (
  <section className="py-16 md:py-24" id="about">
    <div className="container">
      <p className="text-meta mb-8">{post?.title.rendered}</p>
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="grid gap-6" dangerouslySetInnerHTML={{ __html: page?.content.rendered || '' }} />
        <div className="grid grid-cols-2 gap-4">
          {page?.acf.skills.map((stat) => (
            <div key={stat.value} className="p-5 rounded-xl card-shadow bg-card">
              <p className="text-display text-2xl mb-1">{stat.value}</p>
              <p className="text-meta text-[10px]">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)};

export default AboutSection;
