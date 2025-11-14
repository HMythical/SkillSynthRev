import { useEffect, useRef } from "react";
import "./BackgroundFX.css";

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * 1.2;   // oversize for smooth movement
      canvas.height = window.innerHeight * 1.2;
      drawStaticGrid();
    };

    const drawStaticGrid = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const gridSize = 55; // lighter cost
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
          const offset =
            Math.sin(x * 0.008) * 6 +
            Math.cos(y * 0.008) * 6;
          ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // === GPU animation using CSS transform ===
    let t = 0;
    let raf: number;

    const animate = () => {
      t += 0.08;
      if (canvas) {
        canvas.style.transform = `translate3d(${Math.sin(t) * 20}px, ${Math.cos(t) * 20}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="BGRoot">
      <canvas ref={canvasRef} className="WaveCanvas" />
      <div className="Scanlines"></div>
      <div className="Vignette"></div>
    </div>
  );
}
