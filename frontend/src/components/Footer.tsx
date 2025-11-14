import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="DashFooter">
      <div className="DashFooter-glow" aria-hidden="true" />

      <div className="DashFooter-inner">
        <div className="DashFooter-left">
          <div className="FooterBrand">
            <span className="FooterBrandMain">
              <span className="FooterBrandText">SkillSynth</span>
              <span className="FooterBrandShine" />
            </span>
            <span className="FooterBrandSub">/ system status · rev 0.2.0</span>
          </div>

          <div className="FooterMeta">
            <span>© {year} SkillSynth</span>
          </div>
        </div>

        <nav className="DashFooter-links" aria-label="footer">
          <a className="FooterLink" href="/contact" target="_blank" rel="noreferrer">
            <span className="FooterLinkLabel">Contact</span>
            <span className="FooterLinkGlow" />
          </a>
          <a className="FooterLink" href="https://discord.gg/3m3hew5Hr7" target="_blank" rel="noreferrer">
            <span className="FooterLinkLabel">Discord</span>
            <span className="FooterLinkGlow" />
          </a>
          <a className="FooterLink" href="https://github.com/ibernal1815/main" target="_blank" rel="noreferrer">
            <span className="FooterLinkLabel">GitHub</span>
            <span className="FooterLinkGlow" />
          </a>
          <a className="FooterLink" href="https://www.youtube.com" target="_blank" rel="noreferrer">
            <span className="FooterLinkLabel">YouTube</span>
            <span className="FooterLinkGlow" />
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
