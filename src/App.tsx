import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./context/LanguageContext";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingOverlay from "./components/LoadingOverlay";
import { useEffect } from "react";
import Index from "./pages/Index.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // If there's a hash, scroll to that element
      if (location.hash) {
        const anchorId = location.hash.replace('#', '');
        const element = document.getElementById(anchorId);

        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Otherwise, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      handleScroll();
    } else {
      window.addEventListener('load', handleScroll);
      return () => window.removeEventListener('load', handleScroll);
    }
  }, [location.pathname, location.hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <LoadingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <LoadingOverlay />
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:lang" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/:lang/portfolio" element={<Portfolio />} />
            <Route path="/projekt/:slug" element={<ProjectDetail />} />
            <Route path="/:lang/projekt/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </TooltipProvider>
        </LoadingProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
