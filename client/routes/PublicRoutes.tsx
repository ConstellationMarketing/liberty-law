import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Index from "@site/pages/Index";
import AboutUs from "@site/pages/AboutUs";
import PracticeAreas from "@site/pages/PracticeAreas";
import ContactPage from "@site/pages/ContactPage";
import PrivacyPolicyPage from "@site/pages/PrivacyPolicyPage";
import TermsPage from "@site/pages/TermsPage";
import ComplaintsPage from "@site/pages/ComplaintsPage";
import PracticeAreaPage from "@site/pages/PracticeAreaPage";
import DynamicPage from "@site/pages/DynamicPage";

const AdminRoutes = lazy(() => import("@site/pages/AdminRoutes"));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/practice-areas" element={<PracticeAreas />} />
      <Route path="/practice-areas/:slug" element={<PracticeAreaPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-and-conditions" element={<TermsPage />} />
      <Route path="/complaints-process" element={<ComplaintsPage />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminRoutes />
          </Suspense>
        }
      />
      <Route path="*" element={<DynamicPage />} />
    </Routes>
  );
}
