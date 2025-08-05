import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";

// Lazy load major components for code splitting
const HomePageWrapper = lazy(() =>
  import("./components/HomePageWrapper").then((module) => ({
    default: module.default,
  }))
);
const FavoritesPage = lazy(() =>
  import("./pages/Favorites").then((module) => ({ default: module.default }))
);
const ProfilePage = lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.default }))
);
const LoginPage = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.default }))
);
const CopyrightPage = lazy(() =>
  import("./pages/Copyright").then((module) => ({ default: module.default }))
);
const TermsPage = lazy(() =>
  import("./pages/Terms").then((module) => ({ default: module.default }))
);
const PrivacyPage = lazy(() =>
  import("./pages/Privacy").then((module) => ({ default: module.default }))
);

// Loading component for lazy-loaded routes
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

function App() {
  return (
    <FirebaseProvider>
      <DarkModeProvider>
        <LanguageProvider>
          <AccessibilityProvider>
            <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePageWrapper />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/copyright" element={<CopyrightPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <PWAInstallPrompt />
            </div>
          </AccessibilityProvider>
        </LanguageProvider>
      </DarkModeProvider>
    </FirebaseProvider>
  );
}

export default App;
