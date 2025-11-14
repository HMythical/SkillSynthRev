import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import "./styles/globals.css";

function AppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Determine current page segment
  const seg = pathname.split("/")[2] || "dashboard";
  const currentPage = (
    ["dashboard", "projects", "groups", "learn", "about", "profile"].includes(seg)
      ? seg
      : "dashboard"
  ) as "dashboard" | "projects" | "groups" | "learn" | "about" | "profile";

  // Navigation handlers
  const onDashboardClick = () => navigate("/app/dashboard");
  const onProjectsClick = () => navigate("/app/projects");
  const onGroupsClick = () => navigate("/app/groups");
  const onLearnClick = () => navigate("/app/learn");
  const onAboutClick = () => navigate("/app/about");
  const onProfileClick = () => navigate("/app/profile");

  return (
    <div
      className="AppShellRoot"
      style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}
    >
      {/* BackgroundFX REMOVED from here */}

      <Navbar
        currentPage={currentPage}
        onDashboardClick={onDashboardClick}
        onProjectsClick={onProjectsClick}
        onGroupsClick={onGroupsClick}
        onLearnClick={onLearnClick}
        onAboutClick={onAboutClick}
        onProfileClick={onProfileClick}
      />

      <main
        className="AppMainRegion"
        style={{ position: "relative", zIndex: 1, flex: 1 }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default AppShell;
