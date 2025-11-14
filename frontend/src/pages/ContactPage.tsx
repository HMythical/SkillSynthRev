import "./ContactPage.css";

export default function ContactPage() {
  return (
    <div className="ContactPage">

      {/* HEADER STRIP */}
      <section className="ConsoleHeader ContactHeaderStrip">
        <div className="ConsoleHeader-left">
          <h2 className="ConsoleTitle">CONTACT</h2>
          <div className="ConsoleSub">
            <span className="ConsoleSubLabel">channel</span>
            <span className="ConsoleSubValue ConsoleGlare">/comm-link</span>
          </div>
        </div>

        <div className="ConsoleHeader-right">
          <span className="ConsolePill ConsolePill-stable">STATUS: OPEN</span>
          <span className="ConsolePill ConsolePill-rev">REV 0.1.0</span>
        </div>
      </section>

      {/* GRID */}
      <section className="ContactGrid">

        {/* LEFT PANEL – Contact Info */}
        <div className="ContactCard InfoCard">
          <div className="InfoTitle">Signal Channels</div>

          <div className="InfoBlock">
            <div className="InfoLabel">Email</div>
            <div className="InfoValue">
              contact@skillsynth.app
            </div>
          </div>

          <div className="InfoBlock">
            <div className="InfoLabel">Discord</div>
            <div className="InfoValue">
              @SkillSynth
            </div>
          </div>

          <div className="InfoBlock">
            <div className="InfoLabel">GitHub</div>
            <a
              className="InfoValue InfoLink"
              href="https://github.com/yourgithub"
              target="_blank"
            >
              github.com/yourgithub
            </a>
          </div>

          <div className="InfoBlock">
            <div className="InfoLabel">Location</div>
            <div className="InfoValue">Earth • Sector 7</div>
          </div>
        </div>

        {/* RIGHT PANEL – Contact Form */}
        <div className="ContactCard FormCard">
          <div className="FormHeader">
            <div className="FormTitle">Send a Message</div>
            <div className="FormMeta">we'll respond asap</div>
          </div>

          <form className="ContactForm">
            <div className="FormField">
              <label>Your Name</label>
              <input className="FormInput" placeholder="ex: Isaiah" />
            </div>

            <div className="FormField">
              <label>Your Email</label>
              <input className="FormInput" placeholder="ex: you@example.com" />
            </div>

            <div className="FormField">
              <label>Message</label>
              <textarea className="FormTextarea" placeholder="Write your message..." />
            </div>

            <button type="submit" className="SendBtn">
              Transmit →
            </button>
          </form>
        </div>

      </section>
    </div>
  );
}
