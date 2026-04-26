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
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

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
            <Route path="/projects" element={<Portfolio />} />
            <Route path="/:lang/projects" element={<Portfolio />} />
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
