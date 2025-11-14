import { useState } from "react";
import "./ProjectsPage.css";

function ProjectsPage() {
  const [open, setOpen] = useState(false);

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
          <span className="ConsolePill ConsolePill-stable">
            VISIBILITY: INTERNAL
          </span>
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

        <button
          type="button"
          className="NewProjectBtn"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="NewProjectMain">{open ? "Close" : "+ New Project"}</span>
          <span className="NewProjectSub">Configure project</span>
        </button>

        {open && (
          <div className="NewProjectDropdown">
            <NewProjectDropdown />
          </div>
        )}
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

function NewProjectDropdown() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("Learning");

  const [skills, setSkills] = useState<{ name: string; level: string }[]>([]);

  const confidenceLevels = [
    "Learning",
    "Competent",
    "Proficient",
    "Expert",
  ];

  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contact, setContact] = useState("");

  const fakeUsers = ["Aisha", "Marcus", "Leo", "Chloe", "Evelyn"];
  const results =
    query.trim().length > 0
      ? fakeUsers.filter((u) =>
          u.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const addSkill = () => {
    if (!skill.trim()) return;
    setSkills([...skills, { name: skill.trim(), level }]);
    setSkill("");
  };

  const removeSkill = (name: string) =>
    setSkills(skills.filter((s) => s.name !== name));

  const addMember = (m: string) => {
    if (!members.includes(m)) {
      setMembers([...members, m]);
    }
    setQuery("");
  };

  const removeMember = (m: string) =>
    setMembers(members.filter((x) => x !== m));

  return (
    <div className="NPForm">
      <div className="NPGrid">
        {/* LEFT COLUMN */}
        <div className="NPColumn">
          <div className="NPField">
            <label>Project Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="NPField">
            <label>Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Short description"
            />
          </div>

          {/* SKILLS */}
          <div className="NPField">
            <label>Skills</label>

            {/* Skill Input */}
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="React, Python, Networking…"
            />

            {/* Level dropdown */}
            <select
              className="NPSelect"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {confidenceLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            {/* Add Button */}
            <button className="BtnConsole SkillAddBtn" onClick={addSkill}>
              Add +
            </button>

            {/* Skill Chips */}
            <div className="SkillChips">
              {skills.map((s) => (
                <div key={s.name} className="SkillChip">
                  <span>{s.name}</span>
                  <div className={`SkillLevelTag ${s.level}`}>
                    {s.level}
                  </div>
                  <span
                    className="SkillRemove"
                    onClick={() => removeSkill(s.name)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="NPDivider"></div>

        {/* RIGHT COLUMN */}
        <div className="NPColumn">
          <div className="NPField">
            <label>Add Members</label>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by display name"
            />

            {results.length > 0 && (
              <div className="MemberSearchBox">
                {results.map((name) => (
                  <div
                    key={name}
                    className="MemberResult"
                    onClick={() => addMember(name)}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}

            <div className="MemberChips">
              {members.map((m) => (
                <span key={m} className="MemberChip" onClick={() => removeMember(m)}>
                  {m} ×
                </span>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="NPField">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="NPField">
            <label>Finish Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Contact */}
          <div className="NPField">
            <label>Contact Information</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email, Discord, etc"
            />
          </div>

          {/* Finish */}
          <button className="NewProjectBtn CreateProjectBtn">Create Project</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
