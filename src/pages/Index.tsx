import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RecentProjectsSection from "@/components/RecentProjectsSection";
import ContactSection from "@/components/ContactSection";
import GeometricBackground from "@/components/GeometricBackground";

const Index = () => (
  <div className="min-h-screen relative">
    <GeometricBackground />
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
