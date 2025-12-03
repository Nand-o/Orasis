import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './features/home/HomePage';
import ShowcaseDetailPage from './features/showcase/ShowcaseDetailPage';
import ShowcaseSearchPage from './features/showcase/ShowcaseSearchPage';
import AboutPage from './features/about/AboutPage';
import CollectionPage from './features/collections/CollectionPage';
import ShowcaseFormPage from './features/showcase/ShowcaseFormPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/profile/DashboardPage';
import AdminPendingReviewPage from './features/admin/AdminPendingReviewPage';
import AdminUsersPage from './features/admin/AdminUsersPage';
import AdminAnalyticsPage from './features/admin/AdminAnalyticsPage';
import CategoryManagementPage from './features/admin/CategoryManagementPage';
import TagManagementPage from './features/admin/TagManagementPage';
import ProfilePage from './features/profile/ProfilePage';
import ProfilePageNew from './features/profile/ProfilePageNew';
import LandingPage from './features/landingPage/LandingPage';
import { CollectionProvider } from './context/CollectionContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Import Overview Pages and Dashboard Layout
import AdminOverviewPage from './features/admin/AdminOverviewPage';
import UserOverviewPage from './features/profile/UserOverviewPage';
import DashboardLayout from './components/layout/DashboardLayout';

// Component to conditionally render dashboard based on user role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <DashboardLayout><UserOverviewPage /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      {user.role === 'admin' ? <AdminOverviewPage /> : <UserOverviewPage />}
    </DashboardLayout>
  );
};

const AnimatedRoutes = ({ searchValue }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <LandingPage />
          }
        />
        <Route
          path="/home"
          element={
            <PageWrapper>
              <HomePage searchValue={searchValue} />
            </PageWrapper>
          }
        />
        <Route
          path="/design/:id"
          element={
            <PageWrapper>
              <ShowcaseDetailPage />
            </PageWrapper>
          }
        />
        <Route
          path="/search"
          element={
            <PageWrapper>
              <ShowcaseSearchPage />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          }
        />
        <Route
          path="/collections"
          element={
            <PageWrapper>
              <CollectionPage />
            </PageWrapper>
          }
        />
        <Route
          path="/showcase/new"
          element={
            <PageWrapper>
              <ShowcaseFormPage />
            </PageWrapper>
          }
        />
        <Route
          path="/showcase/edit/:id"
          element={
            <PageWrapper>
              <ShowcaseFormPage />
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={<DashboardRouter />}
        />
        <Route
          path="/dashboard/showcases"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/collections"
          element={
            <DashboardLayout>
              <CollectionPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/pending"
          element={
            <DashboardLayout>
              <AdminPendingReviewPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <DashboardLayout>
              <AdminUsersPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/categories"
          element={
            <DashboardLayout>
              <CategoryManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/tags"
          element={
            <DashboardLayout>
              <TagManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <DashboardLayout>
              <AdminAnalyticsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <ProfilePage />
            </PageWrapper>
          }
        />
        <Route
          path="/profile1"
          element={
            <PageWrapper>
              <ProfilePageNew />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
      </Routes>
    </AnimatePresence>
  );
};

// Wrapper to conditionally use Layout or not
const ConditionalLayout = ({ children, searchValue, onSearchChange }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isLandingPage = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // Dashboard routes, Landing Page, and Auth pages use their own layout (or no layout)
  if (isDashboardRoute || isLandingPage || isAuthPage) {
    return children;
  }

  return (
    <Layout searchValue={searchValue} onSearchChange={onSearchChange}>
      {children}
    </Layout>
  );
};

function App() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <AuthProvider>
      <CollectionProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ConditionalLayout searchValue={searchValue} onSearchChange={(e) => setSearchValue(e.target.value)}>
              <AnimatedRoutes searchValue={searchValue} />
            </ConditionalLayout>
          </BrowserRouter>
        </ThemeProvider>
      </CollectionProvider>
    </AuthProvider>
  );
}

export default App;
