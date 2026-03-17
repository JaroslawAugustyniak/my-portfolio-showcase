import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RecentProjectsSection from "@/components/RecentProjectsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <RecentProjectsSection />
      <ContactSection />
    </main>
    <Footer />
  </div>
);

export default Index;
