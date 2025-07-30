import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ModelConfiguration from './pages/model-configuration';
import AuditTrailViewer from './pages/audit-trail-viewer';
import LiveExecutionVisualizer from './pages/live-execution-visualizer';
import ExecutionDashboard from './pages/execution-dashboard';
import PerformanceAnalytics from './pages/performance-analytics';
import SessionManagement from './pages/session-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AuditTrailViewer />} />
        <Route path="/model-configuration" element={<ModelConfiguration />} />
        <Route path="/audit-trail-viewer" element={<AuditTrailViewer />} />
        <Route path="/live-execution-visualizer" element={<LiveExecutionVisualizer />} />
        <Route path="/execution-dashboard" element={<ExecutionDashboard />} />
        <Route path="/performance-analytics" element={<PerformanceAnalytics />} />
        <Route path="/session-management" element={<SessionManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
