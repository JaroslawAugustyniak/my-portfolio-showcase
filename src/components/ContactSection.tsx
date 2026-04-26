import { Mail, Linkedin } from "lucide-react";

import { useState, useEffect } from "react";
import { getPostBySlug } from "@/lib/wordpress-api";
import { WordPressPost } from "@/lib/wordpress.types";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";


const ContactSection = () => {

  const [post, setPost] = useState<WordPressPost | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (!currentLanguage) return;
    getPostBySlug('contact', 'section', currentLanguage.slug).then(setPost);
  }, [currentLanguage]);

  return (

  <section className="py-16 md:py-16" id="contact">
    <div className="container">
      <p className="text-meta mb-8">{post?.title.rendered}</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl card-shadow bg-card">
          <p className="text-meta text-[10px] mb-3">{getTranslation(currentLanguage?.slug || 'pl', 'contactName')}</p>
          <p className="font-display text-lg font-semibold text-foreground">
            {post?.acf?.name}
          </p>
        </div>

        <div className="p-6 rounded-xl card-shadow bg-card">
          <p className="text-meta text-[10px] mb-3">{getTranslation(currentLanguage?.slug || 'pl', 'contactLinks')}</p>
          <div className="flex flex-col gap-3"  dangerouslySetInnerHTML={{ __html: post?.acf?.links || '' }} />
        </div>

        <div className="p-6 rounded-xl card-shadow bg-card">
          <p className="text-meta text-[10px] mb-3">{getTranslation(currentLanguage?.slug || 'pl', 'contactEmail')}</p>
          <a
            href={`mailto:${post?.acf?.email}`}
            className="inline-flex items-center gap-2 font-display text-foreground hover:text-primary transition-smooth break-all"
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            {post?.acf?.email}
          </a>
        </div>
      </div>
    </div>
  </section>
);
};

export default ContactSection;
