import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import RequireAuth from "./RequireAuth";

import AppShell from "./AppShell";
import Footer from "./components/Footer";
import BackgroundFX from "./components/BackgroundFX";

import Splash from "./pages/Splash";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import GroupsPage from "./pages/GroupsPage";
import LearnPage from "./pages/LearnPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Router>

      {/* Global Background */}
      <div style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 0
      }}>
        <BackgroundFX />
      </div>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicShell />}>
          <Route path="/" element={<Splash />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* AUTH ROUTES (AppShell moved OUTSIDE as wrapper) */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppShell />   {/* WRAPS authenticated routes once */}
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

      </Routes>

    </Router>
  );
}

function PublicShell() {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      zIndex: 1
    }}>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
