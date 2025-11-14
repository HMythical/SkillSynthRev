import { useMemo } from "react";
import "./AboutPage.css";

type Contact = {
  email?: string;
  discord?: string;
  linkLabel?: string;
  linkUrl?: string;
};

type Person = {
  id: string;
  name: string;
  role: string;
  desc?: string;
  avatarClass?: string;         // keep your gradient avatars like PresAvatar, DevAvatar1, etc.
  avatarUrl?: string;           // if you later wire live images (Discord), this will override avatarClass
  contact?: Contact;
  highlight?: boolean;
  roleTagClass?: string;        // e.g., "role-president"
};

function PersonCard({ p }: { p: Person }) {
  return (
    <div className={`PersonCard ${p.highlight ? "highlight" : ""}`}>
      <div
        className={`PersonAvatar ${p.avatarClass ?? ""}`}
        style={p.avatarUrl ? { backgroundImage: `url(${p.avatarUrl})` } : undefined}
      />
      <div className="PersonMetaWrap">
        <div className="PersonNameRow">
          <div className="PersonName">{p.name}</div>
          <div className={`PersonRoleTag ${p.roleTagClass ?? ""}`}>{p.role}</div>
        </div>
        {p.desc ? <div className="PersonDesc">{p.desc}</div> : null}
        {p.contact ? (
          <div className="PersonContact">
            {p.contact.email && <div className="ContactLine">📧 {p.contact.email}</div>}
            {p.contact.discord && <div className="ContactLine">💬 {p.contact.discord}</div>}
            {p.contact.linkUrl && (
              <div className="ContactLine">
                🔗 <a href={p.contact.linkUrl} target="_blank" rel="noreferrer">{p.contact.linkLabel ?? p.contact.linkUrl}</a>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AboutPage() {
  // ----- Data (static for now; easy to swap to live API later) ----------------
  const president = useMemo<Person>(() => ({
    id: "pres",
    name: "President Name",
    role: "President · SOSE",
    roleTagClass: "role-president",
    avatarClass: "PresAvatar",
    highlight: true,
    desc:
      "Drives direction, culture, and partnerships. Keeps the crew shipping real projects instead of collecting buzzwords.",
    contact: { email: "president@sose.csun.edu", discord: "@president", linkLabel: "Portfolio", linkUrl: "#" },
  }), []);

  const vicePresident = useMemo<Person>(() => ({
    id: "vp",
    name: "Vice President Name",
    role: "Vice President · SOSE",
    roleTagClass: "role-vice",
    avatarClass: "VPAvatar",
    desc:
      "Operations lead — runs sessions, onboarding, and team syncs. Turns chaos into cadence.",
    contact: { email: "vp@sose.csun.edu", discord: "@vicepres", linkLabel: "LinkedIn", linkUrl: "#" },
  }), []);

  const officers = useMemo<Person[]>(() => [
    {
      id: "off1",
      name: "Officer One",
      role: "Operations",
      avatarClass: "OfficerAvatar1",
      desc: "Scheduling, rooms, check-ins, and making sure new members aren’t lost on day one.",
      contact: { email: "ops@sose.csun.edu", discord: "@ops" },
    },
    {
      id: "off2",
      name: "Officer Two",
      role: "Community / Outreach",
      avatarClass: "OfficerAvatar2",
      desc: "Recruiting, comms, Discord hygiene, and external collabs.",
      contact: { email: "outreach@sose.csun.edu", discord: "@community" },
    },
    {
      id: "off3",
      name: "Officer Three",
      role: "Events",
      avatarClass: "OfficerAvatar3",
      desc: "Workshops, CTF nights, build sprints, mini hack jams.",
      contact: { email: "events@sose.csun.edu", discord: "@events" },
    },
  ], []);

  const developers = useMemo<Person[]>(() => [
    {
      id: "dev1",
      name: "Dev One",
      role: "Frontend / UX",
      avatarClass: "DevAvatar1",
      desc: "Splash screen, animated grid, dashboard shell, terminal vibe.",
      contact: { email: "dev1@skillsynth.app", discord: "@dev1" },
    },
    {
      id: "dev2",
      name: "Dev Two",
      role: "Backend / Infra",
      avatarClass: "DevAvatar2",
      desc: "Auth, scoring logic, DB schema, project gen pipeline.",
      contact: { email: "dev2@skillsynth.app", discord: "@dev2" },
    },
    {
      id: "dev3",
      name: "Dev Three",
      role: "Security / CTF Portal",
      avatarClass: "DevAvatar3",
      desc: "Challenge hosting, exploit lab infra, scoreboard logic.",
      contact: { email: "dev3@skillsynth.app", discord: "@dev3" },
    },
    {
      id: "dev4",
      name: "Dev Four",
      role: "AI / RAG",
      avatarClass: "DevAvatar4",
      desc: "Prompt pipelines, chunking, eval harness, data contracts.",
      contact: { email: "dev4@skillsynth.app", discord: "@dev4" },
    },
    {
      id: "dev5",
      name: "Dev Five",
      role: "Mobile / Tooling",
      avatarClass: "DevAvatar5",
      desc: "CLI tooling, mobile shell, test scaffolding.",
      contact: { email: "dev5@skillsynth.app", discord: "@dev5" },
    },
  ], []);

  const mentors = useMemo<Person[]>(() => [
    {
      id: "m1",
      name: "Mentor One",
      role: "Security Engineer",
      avatarClass: "MentorAvatar1",
      desc: "From ‘I popped a shell’ to professional write-ups and responsible disclosure.",
      contact: { linkLabel: "Calendly", linkUrl: "#" },
    },
    {
      id: "m2",
      name: "Mentor Two",
      role: "Software / Cloud",
      avatarClass: "MentorAvatar2",
      desc: "Clean code, versioning discipline, deployable builds — not just demos.",
      contact: { linkLabel: "LinkedIn", linkUrl: "#" },
    },
    {
      id: "m3",
      name: "Mentor Three",
      role: "Data / ML",
      avatarClass: "MentorAvatar3",
      desc: "Data contracts, evals, and production hygiene for models.",
      contact: { linkLabel: "Portfolio", linkUrl: "#" },
    },
    {
      id: "m4",
      name: "Mentor Four",
      role: "AppSec",
      avatarClass: "MentorAvatar4",
      desc: "Threat modeling, triage, and real-world risk framing.",
      contact: { linkLabel: "Office Hours", linkUrl: "#" },
    },
  ], []);

  const hackWinners = useMemo<Person[]>(() => [
    {
      id: "h1",
      name: "Team Atlas",
      role: "Hackathon Winners · Spring",
      avatarClass: "HackAvatar1",
      desc: "Realtime bug triage board + Git integration. Shipped and demo-ready.",
      contact: { linkLabel: "Project", linkUrl: "#" },
    },
    {
      id: "h2",
      name: "Team Nova",
      role: "Hackathon Winners · Fall",
      avatarClass: "HackAvatar2",
      desc: "CTF auto-provisioner for lab challenges with scoring API.",
      contact: { linkLabel: "Project", linkUrl: "#" },
    },
  ], []);

  // ----- Render --------------------------------------------------------------
  return (
    <div className="AboutPage">
      {/* HERO / MISSION – now wide and comfy */}
      <section className="AboutMissionBlock is-wide">
        <div className="AboutMissionTop">
          <div className="AboutMissionLeft">
            <div className="AboutPreTitle">/ skillsynth : purpose</div>
            <h2 className="AboutTitle">We build people who build.</h2>

            <div className="AboutBodyLong">
              <p>
                SkillSynth exists for the motivated student who’s tired of vague advice
                and wants a clear track. Not “learn to code” hand-waving — actual maps,
                teams, deliverables, and review.
              </p>
              <p>
                We scope projects to your skill, schedule, and interests. We pair you with a crew.
                We hand you resources that cut fluff and push outcomes. Then we demo, iterate,
                and ship — so you leave receipts, not résumés stuffed with adjectives.
              </p>
              <p className="AboutTagline">
                <span className="TagBadge">student built</span>
                <span className="TagBadge">offense-minded</span>
                <span className="TagBadge">open to learn</span>
              </p>
            </div>
          </div>

          <div className="AboutMissionRight">
            <div className="AboutStatsCard">
              <div className="StatsHeader">sose / status</div>

              <div className="StatsRow">
                <div className="StatLabel">Focus</div>
                <div className="StatValue">Security · Dev · Ops</div>
              </div>

              <div className="StatsRow">
                <div className="StatLabel">Goal</div>
                <div className="StatValue">Grow builders, not resume parrots</div>
              </div>

              <div className="StatsRow">
                <div className="StatLabel">Policy</div>
                <div className="StatValue">Learn ethically // act responsibly</div>
              </div>

              <div className="StatsDivider" />

              <div className="StatsFooter">
                <span className="StatsPill online">ONLINE</span>
                <span className="StatsPill rev">REV 0.2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP: President + Vice President */}
      <section className="AboutSection">
        <div className="SectionHeaderRow">
          <div className="SectionLabelBlock">
            <div className="SectionLabel">Leadership</div>
            <div className="SectionSub">core team / points of contact</div>
          </div>
        </div>

        <div className="PeopleGrid two">
          <PersonCard p={president} />
          <PersonCard p={vicePresident} />
        </div>
      </section>

      {/* OFFICERS */}
      <section className="AboutSection">
        <div className="SectionHeaderRow">
          <div className="SectionLabelBlock">
            <div className="SectionLabel">Officers</div>
            <div className="SectionSub">ops, outreach, logistics</div>
          </div>
        </div>

        <div className="PeopleGrid">
          {officers.map((o) => <PersonCard key={o.id} p={o} />)}
        </div>
      </section>

      {/* HACKATHON WINNERS */}
      <section className="AboutSection">
        <div className="SectionHeaderRow">
          <div className="SectionLabelBlock">
            <div className="SectionLabel">Hackathon Winners</div>
            <div className="SectionSub">last cycles · shipped projects</div>
          </div>
        </div>

        <div className="PeopleGrid">
          {hackWinners.map((h) => <PersonCard key={h.id} p={h} />)}
        </div>
      </section>

      {/* DEV TEAM – 5 devs */}
      <section className="AboutSection">
        <div className="SectionHeaderRow">
          <div className="SectionLabelBlock">
            <div className="SectionLabel">Developers</div>
            <div className="SectionSub">core SkillSynth engineers / builders</div>
          </div>
        </div>

        <div className="PeopleGrid">
          {developers.map((d) => <PersonCard key={d.id} p={d} />)}
        </div>
      </section>

      {/* MENTORS – expanded */}
      <section className="AboutSection">
        <div className="SectionHeaderRow">
          <div className="SectionLabelBlock">
            <div className="SectionLabel">Mentors</div>
            <div className="SectionSub">guidance, review, career reality checks</div>
          </div>
        </div>

        <div className="PeopleGrid">
          {mentors.map((m) => <PersonCard key={m.id} p={m} />)}
        </div>
      </section>

      {/* CLOSER */}
      <section className="AboutCloser">
        <div className="CloserShell">
          <div className="CloserLineMain">This is not a class. This is a launchpad.</div>
          <div className="CloserLineSub">
            Build with a crew. Ship something real. Point at it and say: “yeah, I built that.”
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
