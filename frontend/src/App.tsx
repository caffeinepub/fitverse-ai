import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { AppProvider } from './contexts/AppContext';
import AnimatedBackground from './components/AnimatedBackground';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import TrialHub from './pages/TrialHub';
import BodyScan from './pages/BodyScan';
import Wardrobe from './pages/Wardrobe';

// Root layout with sidebar (used for all pages except landing)
function AppLayout() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Sidebar />
      <Outlet />
    </div>
  );
}

// Landing layout without sidebar
function LandingLayout() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Outlet />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const landingLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'landing-layout',
  component: LandingLayout,
});

const landingRoute = createRoute({
  getParentRoute: () => landingLayoutRoute,
  path: '/',
  component: Landing,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
});

const shopRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/shop',
  component: Shop,
});

const trialHubRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/trial-hub',
  component: TrialHub,
});

const bodyScanRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/body-scan',
  component: BodyScan,
});

const wardrobeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/wardrobe',
  component: Wardrobe,
});

const routeTree = rootRoute.addChildren([
  landingLayoutRoute.addChildren([landingRoute]),
  appLayoutRoute.addChildren([shopRoute, trialHubRoute, bodyScanRoute, wardrobeRoute]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
