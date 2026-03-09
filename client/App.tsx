import "./global.css";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { SessionAuthProvider } from "./contexts/SessionAuthContext";
import { SessionLoginGate } from "./components/auth/SessionLoginGate";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import GlobalScripts from "./components/GlobalScripts";
import WcDniManager from "./components/WcDniManager";

// Lazy-loaded routes for code splitting
const AboutUs = lazy(() => import("./pages/AboutUs"));
const PracticeAreas = lazy(() => import("./pages/PracticeAreas"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminRoutes = lazy(() => import("./pages/AdminRoutes"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ComplaintsPage = lazy(() => import("./pages/ComplaintsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <SessionAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <GlobalScripts />
              <WcDniManager />
              <ScrollToTop />
              <Suspense fallback={null}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <SessionLoginGate>
                        <Index />
                      </SessionLoginGate>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <SessionLoginGate>
                        <AboutUs />
                      </SessionLoginGate>
                    }
                  />
                  <Route
                    path="/practice-areas"
                    element={
                      <SessionLoginGate>
                        <PracticeAreas />
                      </SessionLoginGate>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <SessionLoginGate>
                        <ContactPage />
                      </SessionLoginGate>
                    }
                  />
                  <Route path="/admin/*" element={<AdminRoutes />} />
                  <Route
                    path="/privacy-policy"
                    element={
                      <SessionLoginGate>
                        <PrivacyPolicyPage />
                      </SessionLoginGate>
                    }
                  />
                  <Route
                    path="/terms-and-conditions"
                    element={
                      <SessionLoginGate>
                        <TermsPage />
                      </SessionLoginGate>
                    }
                  />
                  <Route
                    path="/complaints-process"
                    element={
                      <SessionLoginGate>
                        <ComplaintsPage />
                      </SessionLoginGate>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </SessionAuthProvider>
      </SiteSettingsProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
