import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import CategoryManagement from './pages/category-management';
import AuthenticationPage from './pages/authentication-login-register';
import SEOTools from './pages/seo-tools';
import Dashboard from './pages/dashboard';
import SavedItems from './pages/saved-items';
import AdvancedSearch from './pages/advanced-search';
import Settings from './pages/settings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<AdvancedSearch />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/login" element={<AuthenticationPage />} />
        <Route path="/signup" element={<AuthenticationPage />} />
        <Route path="/register" element={<AuthenticationPage />} />
        <Route path="/authentication-login-register" element={<AuthenticationPage />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/saved-items" element={<ProtectedRoute><SavedItems /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/seo-tools" element={<ProtectedRoute><SEOTools /></ProtectedRoute>} />
        <Route path="/category-management" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;