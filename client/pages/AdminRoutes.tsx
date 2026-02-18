import { lazy, Suspense, Component, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Lazy load admin components from cms-core submodule
// This prevents the route scanner from following these imports at build time
const AdminLayout = lazy(
  () => import("../../vendor/cms-core/client/components/admin/AdminLayout"),
);
const AdminLogin = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminLogin"),
);
const AdminDashboard = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminDashboard"),
);
const AdminPages = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminPages"),
);
const AdminPageNew = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminPageNew"),
);
const AdminPageEdit = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminPageEdit"),
);
const AdminRedirects = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminRedirects"),
);
const AdminTemplates = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminTemplates"),
);
const AdminMediaLibrary = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminMediaLibrary"),
);
const AdminUsers = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminUsers"),
);
const AdminSiteSettings = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminSiteSettings"),
);
const AdminSearchReplace = lazy(
  () => import("../../vendor/cms-core/client/pages/admin/AdminSearchReplace"),
);

// Loading fallback for admin pages
function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <p className="text-gray-600 text-sm">Loading admin...</p>
      </div>
    </div>
  );
}

// Error fallback for admin pages
function AdminError({ error }: { error: Error }) {
  console.error("[AdminRoutes] Error loading component:", error);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4 max-w-lg p-8 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-600">Error Loading Admin</h2>
        <p className="text-gray-600">{error.message}</p>
        <pre className="text-xs text-gray-500 bg-gray-100 p-4 rounded overflow-auto max-w-full">
          {error.stack}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

// Error Boundary to catch rendering errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <AdminError error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Admin Routes Configuration
 *
 * - Login page is rendered WITHOUT the AdminLayout (no sidebar)
 * - All other admin pages are wrapped in AdminLayout which provides:
 *   - Sidebar navigation
 *   - Authentication checking (redirects to login if not authenticated)
 *   - Consistent layout structure
 *
 * NOTE: All admin components are lazy-loaded to improve route detection
 * performance and reduce initial bundle size.
 */
export default function AdminRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AdminLoading />}>
        <Routes>
          {/* Login stays OUTSIDE the layout - no sidebar on login page */}
          <Route path="login" element={<AdminLogin />} />

          {/* All protected routes wrapped in AdminLayout */}
          <Route element={<AdminLayout />}>
            {/* Default /admin -> /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Page management */}
            <Route path="pages" element={<AdminPages />} />
            <Route path="pages/new" element={<AdminPageNew />} />
            <Route
              path="pages/:id"
              element={
                <Suspense fallback={<AdminLoading />}>
                  <AdminPageEdit />
                </Suspense>
              }
            />

            {/* Content & media */}
            <Route path="media" element={<AdminMediaLibrary />} />
            <Route path="search-replace" element={<AdminSearchReplace />} />

            {/* Site configuration */}
            <Route path="site-settings" element={<AdminSiteSettings />} />
            <Route path="redirects" element={<AdminRedirects />} />
            <Route path="templates" element={<AdminTemplates />} />

            {/* User management */}
            <Route path="users" element={<AdminUsers />} />

            {/* Catch-all inside /admin */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
