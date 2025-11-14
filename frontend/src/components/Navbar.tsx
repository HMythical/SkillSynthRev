import "./Navbar.css";

type NavbarProps = {
  currentPage: "dashboard" | "projects" | "groups" | "learn" | "about" | "profile";
  onDashboardClick: () => void;
  onProjectsClick: () => void;
  onGroupsClick: () => void;
  onLearnClick: () => void;
  onAboutClick: () => void;
  onProfileClick: () => void;
};

function Navbar({
  currentPage,
  onDashboardClick,
  onProjectsClick,
  onGroupsClick,
  onLearnClick,
  onAboutClick,
  onProfileClick,
}: NavbarProps) {
  return (
    <header className="DashNav">
      <div className="DashNav-glow" aria-hidden="true" />

      <div className="DashNav-inner">
        <div className="DashNav-left">
          <div className="DashBrand">
            <span className="BrandMain">
              <span className="BrandText">SkillSynth</span>
              <span className="BrandShine" />
            </span>
            <span className="BrandSub">/ control panel</span>
          </div>

          <nav className="DashLinks">
            <button
              className={
                "DashLink" +
                (currentPage === "dashboard" ? " DashLink-active" : "")
              }
              onClick={onDashboardClick}
            >
              <span className="DashLinkLabel">Dashboard</span>
              <span className="DashLinkGlow" />
            </button>

            <button
              className={
                "DashLink" +
                (currentPage === "projects" ? " DashLink-active" : "")
              }
              onClick={onProjectsClick}
            >
              <span className="DashLinkLabel">Projects</span>
              <span className="DashLinkGlow" />
            </button>

            <button
              className={
                "DashLink" +
                (currentPage === "groups" ? " DashLink-active" : "")
              }
              onClick={onGroupsClick}
            >
              <span className="DashLinkLabel">Groups</span>
              <span className="DashLinkGlow" />
            </button>

            <button
              className={
                "DashLink" +
                (currentPage === "learn" ? " DashLink-active" : "")
              }
              onClick={onLearnClick}
            >
              <span className="DashLinkLabel">Learn</span>
              <span className="DashLinkGlow" />
            </button>

            <button
              className={
                "DashLink" +
                (currentPage === "about" ? " DashLink-active" : "")
              }
              onClick={onAboutClick}
            >
              <span className="DashLinkLabel">About</span>
              <span className="DashLinkGlow" />
            </button>
          </nav>
        </div>

        <div className="DashNav-right">
          <button
            className="ProfileBtn"
            title="Profile"
            onClick={onProfileClick}
          >
            <div className="ProfileIcon" aria-hidden="true">
              <div className="ProfileHead" />
              <div className="ProfileBody" />
              <div className="ProfileStatusLED" />
            </div>

            <span className="ProfileTag">
              {currentPage === "profile" ? "profile" : "you"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
