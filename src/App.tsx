import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import GalleryPage from './pages/GalleryPage';


// Context Providers
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { IcebreakerProvider } from './context/IcebreakerContext';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <IcebreakerProvider>
          <Router>
            <AppContent />
          </Router>
        </IcebreakerProvider>
      </EventProvider>
    </AuthProvider>
  );
}

const AppContent = () => {
  const location = useLocation();
  return (
    <div className="App min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <PageTransition><EventsPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <PageTransition><EventDetailPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/create"
              element={
                <ProtectedRoute requiredRole="admin">
                  <PageTransition><CreateEventPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <PageTransition><GalleryPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="/payment/:eventId" element={<PageTransition><PaymentPage /></PageTransition>} />
            <Route path="/payment-success" element={<PageTransition><PaymentSuccess /></PageTransition>} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition><ProfilePage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <PageTransition><AdminDashboard /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;