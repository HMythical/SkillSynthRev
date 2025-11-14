import "./ProjectsPage.css";

function ProjectsPage() {
  return (
    <div className="ProjectsPage">
      <section className="ConsoleHeader ProjectsHeaderStrip">
        <div className="ConsoleHeader-left">
          <h2 className="ConsoleTitle">PROJECTS</h2>

          <div className="ConsoleSub">
            <span className="ConsoleSubLabel">owned</span>
            <span className="ConsoleSubValue ConsoleGlare">--</span>
            <span className="ConsoleDivider">/</span>
            <span className="ConsoleSubLabel">collab slots</span>
            <span className="ConsoleSubValue">--</span>
          </div>
        </div>

        <div className="ConsoleHeader-right">
          <span className="ConsolePill ConsolePill-stable">VISIBILITY: INTERNAL</span>
          <span className="ConsolePill ConsolePill-rev">REV 0.2.0</span>
        </div>
      </section>

      <section className="ProjectsActionsBar">
        <div className="ProjectsIntroText">
          <div className="IntroTitle">Spin up a new build</div>
          <div className="IntroBody">
            Generate an idea, claim a slot, or pull in teammates.
          </div>
        </div>

        {/* Placeholder (modal removed) */}
        <button type="button" className="NewProjectBtn" disabled>
          <span className="NewProjectMain">+ New Project</span>
          <span className="NewProjectSub">modal removed</span>
        </button>
      </section>

      <section className="ProjectsGrid">
        <div className="ProjectCard">
          <div className="ProjectCardHeader">
            <div className="ProjectTopline">
              <div className="ProjectTitle">No projects found</div>
              <div className="ProjectBadges">
                <span className="ProjectStatusTag Blue">standby</span>
              </div>
            </div>

            <div className="ProjectMetaRow">
              <div className="ProjectMetaItem">
                <span className="MetaLabel">Stack</span>
                <span className="MetaValue">--</span>
              </div>

              <div className="ProjectMetaItem">
                <span className="MetaLabel">Last Updated</span>
                <span className="MetaValue">--</span>
              </div>
            </div>

            <div className="ProjectHeaderBar" />
          </div>

          <div className="ProjectBody">
            <p className="ProjectDesc">
              Once connected to your backend, project cards will populate here.
            </p>

            <ul className="ProjectChecklist">
              <li>Example task 1</li>
              <li className="Strike">Example task 2</li>
            </ul>
          </div>

          <div className="ProjectFooterRow">
            <button type="button" className="CardAction SmallAction" disabled>
              Open →
            </button>
            <button type="button" className="CardAction GhostAction" disabled>
              Assign Teammates
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectsPage;
