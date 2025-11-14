import "./DashboardPage.css";
import { useAuth } from "../state/AuthContext";
import { useEffect, useState, useRef } from "react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Friendly display name
  const name =
    user?.displayName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "operator";

  // Realtime uptime counter
  const startTimeRef = useRef(Date.now());
  const [uptime, setUptime] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Static placeholders (API-ready)
  const sessionActive = true;
  const projectsCount = 3;
  const groupsCount = 1;
  const modulesCount = 5;

  return (
    <div className="DashboardPage">
      {/* TOP STATUS STRIP / PAGE HEADER */}
      <section className="ConsoleHeader">
        <div className="ConsoleHeader-left">
          <h2 className="ConsoleTitle">DASHBOARD</h2>

          <div className="ConsoleSub">
            <span className="ConsoleSubLabel">user</span>
            <span className="ConsoleSubValue ConsoleGlare">{name}</span>
          </div>

          <div className="ConsoleSub">
            <span className="ConsoleSubLabel">session</span>
            <span className="ConsoleSubValue ConsoleGlare">
              {sessionActive ? "ACTIVE" : "INACTIVE"}
            </span>
            <span className="ConsoleDivider">/</span>
            <span className="ConsoleSubLabel">uptime</span>
            <span className="ConsoleSubValue">{uptime}</span>
          </div>
        </div>

        <div className="ConsoleHeader-right">
          <span className="ConsolePill ConsolePill-stable">SYSTEM STABLE</span>
          <span className="ConsolePill ConsolePill-rev">REV 0.2.0</span>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section className="DashSection">
        <h3 className="SectionTitle">Welcome back, {name}.</h3>
        <p className="SectionBody">
          You have{" "}
          <span className="AccentText">{projectsCount}</span> active projects,{" "}
          <span className="AccentText">{groupsCount}</span> open group requests,
          and <span className="AccentText">{modulesCount}</span> new learning
          modules.
        </p>
      </section>

      {/* GRID OF CARDS */}
      <section className="DashGrid">
        {/* PROJECTS CARD */}
        <div className="DashCard">
          <div className="CardHeader">
            <div className="CardHeaderTopline">
              <div className="CardTitle">Projects</div>
              <div className="CardMeta">{projectsCount} active</div>
            </div>
            <div className="CardHeaderBar" />
          </div>

          <div className="CardBody">
            <ul className="MiniList">
              <li>
                <span className="MiniName">AI Code Mentor</span>
                <span className="MiniStatus Green">active</span>
              </li>
              <li>
                <span className="MiniName">CTF Portal</span>
                <span className="MiniStatus Yellow">pending</span>
              </li>
              <li>
                <span className="MiniName">SkillSynth Splash</span>
                <span className="MiniStatus Purple">design</span>
              </li>
            </ul>
          </div>

          <div className="CardFooter">
            <button className="CardAction">View all →</button>
          </div>
        </div>

        {/* GROUPS CARD */}
        <div className="DashCard">
          <div className="CardHeader">
            <div className="CardHeaderTopline">
              <div className="CardTitle">Groups</div>
              <div className="CardMeta">{groupsCount} invite</div>
            </div>
            <div className="CardHeaderBar" />
          </div>

          <div className="CardBody">
            <ul className="MiniList">
              <li>
                <span className="MiniName">SOSE Cyber Lab</span>
                <span className="MiniStatus Blue">invite</span>
              </li>
            </ul>
          </div>

          <div className="CardFooter">
            <button className="CardAction">Manage →</button>
          </div>
        </div>

        {/* LEARN CARD */}
        <div className="DashCard">
          <div className="CardHeader">
            <div className="CardHeaderTopline">
              <div className="CardTitle">Learn</div>
              <div className="CardMeta">{modulesCount} new</div>
            </div>
            <div className="CardHeaderBar" />
          </div>

          <div className="CardBody">
            <ul className="MiniList">
              <li>
                <span className="MiniName">Intro to Memory Corruption</span>
                <span className="MiniStatus Purple">new</span>
              </li>
              <li>
                <span className="MiniName">React + TS Basics</span>
                <span className="MiniStatus Green">in progress</span>
              </li>
              <li>
                <span className="MiniName">MySQL Hardening 101</span>
                <span className="MiniStatus Yellow">queued</span>
              </li>
            </ul>
          </div>

          <div className="CardFooter">
            <button className="CardAction">Resume →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
