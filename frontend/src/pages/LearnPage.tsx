import { useState, useEffect } from "react";
import "./LearnPage.css";

// static options (these are fine to keep local, they drive generation input)
const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const hours = [1, 2, 4, 6, 8, 10];
const skills = [
  "General Programming",
  "Frontend / React",
  "Algorithms & Data Structures",
  "Web Security / Offensive",
  "Cloud (AWS / GCP)",
  "Networking / Cisco / Packet Tracer",
  "Linux / Shell",
  "Reverse Engineering",
];

function LearnPage() {
  // user inputs for generator prompt
  const [level, setLevel] = useState("Beginner");
  const [hour, setHour] = useState(2);
  const [skill, setSkill] = useState("General Programming");

  // rotating little mindset tip
  const [quote, setQuote] = useState("");

  // TODO: when backend is live, replace this with something like:
  // const { generatorStatus, latestSignals, resources } = useLearnData();
  // where:
  // - generatorStatus: status of AI generation API / model
  // - latestSignals: feed items for Signal feed (open roles, tasks, hints)
  // - resources: external resource links for carousel

  const tips = [
    "Your dataset is a mirror. Clean it or you're just training bias.",
    "Stop copy/pasting answers. Explain why they work. That's the skill.",
    "Exploit knowledge is useless if you can't report it clearly.",
    "A simple working tool beats a huge broken rewrite.",
    "Read other people's code like it's an incident report.",
  ];

  useEffect(() => {
    const pick = tips[Math.floor(Math.random() * tips.length)];
    setQuote(pick);
  }, []);

  return (
    <div className="LearnPage">
      {/* HEADER STRIP */}
      <section className="ConsoleHeader LearnHeaderStrip">
        <div className="ConsoleHeader-left">
          <h2 className="ConsoleTitle">LEARN</h2>

          <div className="ConsoleSub">
            <span className="ConsoleSubLabel">adaptive ai projects</span>
            <span className="ConsoleDivider">/</span>

            {/* TODO: This "auto-generated" should eventually reflect model status
                e.g. "READY", "OFFLINE", "RATE LIMITED", etc */}
            <span className="ConsoleSubValue ConsoleGlare">auto-generated</span>
          </div>
        </div>

        <div className="ConsoleHeader-right">
          {/* TODO: could become dynamic "MODE: AI TRAINING", "MODE: REVIEW", etc */}
          <span className="ConsolePill ConsolePill-stable">
            MODE: AI TRAINING
          </span>

          {/* TODO: version should eventually come from build/version info */}
          <span className="ConsolePill ConsolePill-rev">REV 0.2.0</span>
        </div>
      </section>

      {/* GENERATOR BLOCK */}
      <section className="LearnGenerator">
        <div className="LearnGenHeaderBlock">
          <div className="GenTitle">Build me a project</div>
          <div className="GenBody">
            Pick skill focus, level, and time. We'll synthesize a scoped build
            plan you could realistically finish.
          </div>
        </div>

        <div className="LearnGenForm">
          {/* SKILL */}
          <label className="LearnField">
            <span className="LearnFieldLabel">Skill Focus</span>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="LearnSelect"
            >
              {skills.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          {/* LEVEL */}
          <label className="LearnField">
            <span className="LearnFieldLabel">Level</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="LearnSelect"
            >
              {levels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>

          {/* HOURS */}
          <label className="LearnField">
            <span className="LearnFieldLabel">Hours Available</span>
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="LearnSelect"
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h} hrs
                </option>
              ))}
            </select>
          </label>

          {/* GENERATE BUTTON */}
          <button
            className="GenerateBtn"
            // TODO: hook this into backend call or model request
            // onClick={() => generateProjects({ skill, level, hour })}
          >
            Generate AI Projects →
          </button>
        </div>

        {/* this line clarifies exactly what will get sent to backend */}
        <div className="LearnNote">
          Output will target <b>{skill}</b>, difficulty = {level}, scope ≈{" "}
          {hour}h.
          <span className="LearnNoteHint">
            {" "}
            {/* TODO: Once connected to backend,
                swap this text to show e.g. "Last generated 14s ago" */}
            (We'll pipe this into ML + DB later.)
          </span>
        </div>
      </section>

      {/* RESOURCE CAROUSEL */}
      <section className="LearnCarousel">
        <h3 className="CarouselTitle">Learning Resources</h3>

        <div className="CarouselMask">
          <div className="CarouselTrack">
            {/*
              TODO: replace static links below with `resources` from backend.
              Example structure for each resource:
              {
                name: "Hack The Box",
                desc: "Realistic vulns. Attack real boxes.",
                href: "https://www.hackthebox.com/",
                brand: "htb" // used for styling/logo color class
              }

              Then you'd do:
              resources.map(r => (
                <a className="CarouselCard" href={r.href} ... >
                  <div className={`CardImage ${r.brand}`} />
                  <div className="CardTextBlock">
                    <div className="CardName">{r.name}</div>
                    <div className="CardDesc">{r.desc}</div>
                  </div>
                </a>
              ))
            */}

            {/* Placeholder card so layout isn't empty before data loads */}
            <div className="CarouselCard CarouselCard--placeholder">
              <div className="CardTextBlock">
                <div className="CardName">Resources loading…</div>
                <div className="CardDesc">
                  External training links from backend will render here.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNAL FEED / STATUS PANEL */}
      <section className="LearnSignalSection">
        <div className="SignalShell">
          <div className="SignalHeaderRow">
            <div className="SignalLeft">
              <div className="SignalTitle">signal feed</div>
              <div className="SignalMeta">
                real-time status // internal only
              </div>
            </div>

            <div className="SignalRight">
              {/* TODO: show live/offline depending on backend heartbeat */}
              <span className="SignalPill live">LIVE</span>
              <span className="SignalPill rev">REV 0.1.0</span>
            </div>
          </div>

          <div className="SignalBody">
            {/*
              TODO: this entire block becomes a map over "latestSignals"
              from backend. Example shape:
              latestSignals = [
                { type: "OPEN SLOT", color: "green", text: "group X needs Y" },
                { type: "TASK", color: "purple", text: "..."},
                ...
              ]

              Then:
              latestSignals.map(sig => (
                <div className="SignalLine">
                  <span className={`SigTag ${sig.color}`}>{sig.type}</span>
                  <span className="SigText">{sig.text}</span>
                </div>
              ))
            */}

            {/* Placeholder lines so the card doesn't look dead */}
            <div className="SignalLine">
              <span className="SigTag green">OPEN SLOT</span>
              <span className="SigText">
                (backend) Group / open role info will appear here.
              </span>
            </div>

            <div className="SignalLine">
              <span className="SigTag purple">TASK</span>
              <span className="SigText">
                (backend) Generated project spec for {hour}h in {skill} at{" "}
                {level} difficulty will show here after you click Generate.
              </span>
            </div>

            <div className="SignalLine">
              <span className="SigTag blue">RESOURCE</span>
              <span className="SigText">
                (backend) New resource / course drop announcement.
              </span>
            </div>

            <div className="SignalLine">
              <span className="SigTag yellow">REMINDER</span>
              <span className="SigText">
                (backend) Rotating guidance / announcements.
              </span>
            </div>

            {/* Insight / mindset quote */}
            <div className="SignalQuoteRow">
              <div className="SignalQuoteLabel">/ insight</div>
              <div className="SignalQuoteText">
                {/* TODO: could come from backend, for now it's local tip */}
                {quote}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LearnPage;
