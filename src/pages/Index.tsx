import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RecentProjectsSection from "@/components/RecentProjectsSection";
import ContactSection from "@/components/ContactSection";
import ParallaxImage from "@/components/ParallaxImage";
import footerImg from "@/assets/footer-parallax.jpg";

const Index = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <RecentProjectsSection />
      <ContactSection />
    </main>
    <div className="relative h-64 md:h-80 -mb-24 overflow-hidden">
      <ParallaxImage
        src={footerImg}
        alt="Coding close-up"
        speed={0.4}
        className="absolute inset-0 h-full w-full opacity-15 grayscale"
        overlayClassName="bg-gradient-to-b from-background via-transparent to-background"
      />
    </div>
    <Footer />
  </div>
);

export default Index;
