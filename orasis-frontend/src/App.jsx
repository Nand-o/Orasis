import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import HomePage from './features/home/HomePage';
import DesignDetailPage from './features/design/DesignDetailPage';
import SearchResultPage from './features/design/SearchResultPage';
import AboutPage from './features/about/AboutPage';
import CollectionPage from './features/collections/CollectionPage';
import CollectionTestPage from './features/collections/CollectionTestPage';
import ShowcaseTestPage from './features/design/ShowcaseTestPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import { CollectionProvider } from './context/CollectionContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

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

const AnimatedRoutes = ({ searchValue }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
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
              <DesignDetailPage />
            </PageWrapper>
          }
        />
        <Route
          path="/search"
          element={
            <PageWrapper>
              <SearchResultPage />
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
          path="/test-crud"
          element={
            <PageWrapper>
              <ShowcaseTestPage />
            </PageWrapper>
          }
        />
        <Route
          path="/test-collections"
          element={
            <PageWrapper>
              <CollectionTestPage />
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

function App() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <AuthProvider>
      <CollectionProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Layout searchValue={searchValue} onSearchChange={(e) => setSearchValue(e.target.value)}>
              <AnimatedRoutes searchValue={searchValue} />
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </CollectionProvider>
    </AuthProvider>
  );
}

export default App;
