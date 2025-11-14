import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

export default function Splash() {
  const navigate = useNavigate();
  const enter = () => navigate("/auth");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, t = 0, raf = 0;

    const resize = () => {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    };

    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      const rows = 14;
      const start = h * 0.18;
      const heightSpan = h * 0.64;

      for (let i = 0; i < rows; i++) {
        const p = i / (rows - 1);
        const yBase = start + heightSpan * p;

        ctx.strokeStyle = `rgba(255,255,255,${0.18 + 0.35 * (1 - p)})`;
        ctx.lineWidth = 0.6 + 1.2 * (1 - p);

        const amp = 16 + 22 * (1 - p);
        const phase = t * 0.010 + i * 0.35;

        ctx.beginPath();
        for (let x = -60; x <= w + 60; x += 10) {
          const y =
            yBase +
            Math.sin(x * 0.013 + phase) * amp * 0.6 +
            Math.cos(x * 0.007 - phase * 1.1) * amp * 0.4;
          if (x === -60) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // soft purple horizon glow
      const horizon = h * 0.70;
      const rg = ctx.createRadialGradient(w / 2, horizon, 0, w / 2, horizon, h);
      rg.addColorStop(0, "rgba(184,119,255,0.16)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);

      t += 0.8;
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "enter") enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="SplashScreen">
      <canvas ref={canvasRef} className="SplashCanvas" />
      <div className="FXOverlay fx-scanlines" />
      <div className="FXOverlay fx-vignette" />

      <div className="ContentWrap">
        {/* New effect class: chroma */}
        <h1 className="SplashTitle chroma" data-text="SKILLSYNTH">SKILLSYNTH</h1>
        <h2 className="SplashSubtitle">Extension of SOSE Club</h2>
        <button className="EnterBtn neon-bracket" onClick={enter} aria-label="Enter">
          ENTER
        </button>
      </div>

      <div className="FooterMeta fixed-footer">
        <span className="status">ONLINE</span>
        <span className="sep">▪</span>
        <span className="rev">REV 0.1.0</span>
      </div>
    </div>
  );
}
