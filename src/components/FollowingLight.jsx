import React, { useEffect, useRef, useState } from "react";

export default function FollowingLight({ strength = 1 }) {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const lastMoveRef = useRef(0);
  const activeRef = useRef(false);
  const rafRef = useRef(0);
  const seedsRef = useRef({ ax: Math.random()*1000, ay: Math.random()*1000, rx: 0.18, ry: 0.12, speedX: 0.00035, speedY: 0.0005 });

  useEffect(() => {
    const setTarget = (cx, cy) => {
      const w = innerWidth || 1, h = innerHeight || 1, jitter = 12;
      targetRef.current = {
        x: Math.min(0.98, Math.max(0.02, (cx + (Math.random()*jitter - jitter/2)) / w)),
        y: Math.min(0.95, Math.max(0.05, (cy + (Math.random()*jitter - jitter/2)) / h)),
      };
      activeRef.current = true; lastMoveRef.current = performance.now();
    };
    const onMove = (e)=>setTarget(e.clientX,e.clientY);
    const onTouch=(e)=>e.touches?.[0] && setTarget(e.touches[0].clientX, e.touches[0].clientY);
    addEventListener("mousemove", onMove, {passive:true});
    addEventListener("touchmove", onTouch, {passive:true});
    return ()=>{ removeEventListener("mousemove", onMove); removeEventListener("touchmove", onTouch); };
  }, []);

  useEffect(() => {
    const loop = () => {
      const now = performance.now();
      if (now - lastMoveRef.current > 2500) activeRef.current = false;
      const { ax, ay, rx, ry, speedX, speedY } = seedsRef.current;
      let target = targetRef.current;
      if (!activeRef.current) {
        const cx=0.5, cy=0.55;
        target = { x: cx + Math.sin(now*speedX+ax)*rx, y: cy + Math.cos(now*speedY+ay)*ry };
        targetRef.current = target;
      }
      setPos(p => {
        const a = activeRef.current ? 0.18 : 0.06;
        return { x: p.x + (target.x-p.x)*a, y: p.y + (target.y-p.y)*a };
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  }, []);

  const style = { top: `${pos.y*100}%`, left: `${pos.x*100}%`, transform: "translate(-50%, -50%)" };
  const outerOpacity = 0.22*strength, whiteOpacity = Math.max(0.04, 0.08*strength), coreOpacity = 0.7*strength;
  const domeBrightness = 150 + Math.round(50*strength), domeContrast = 125 + Math.round(10*strength);

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      <div className="absolute w-[44vw] h-[44vw] rounded-full blur-3xl mix-blend-screen animate-pulse"
           style={{...style, backgroundColor:`rgba(205,220,57,${outerOpacity})`}}/>
      <div className="absolute w-[28vw] h-[28vw] rounded-full backdrop-blur-sm"
           style={{...style, backgroundColor:`rgba(255,255,255,${whiteOpacity})`,
             WebkitBackdropFilter:`brightness(${domeBrightness}%) contrast(${domeContrast}%)`,
             backdropFilter:`brightness(${domeBrightness}%) contrast(${domeContrast}%)`}}/>
      <div className="absolute w-[12vw] h-[12vw] rounded-full blur-xl"
           style={{...style, backgroundColor:`rgba(255,255,255,${coreOpacity})`}}/>
    </div>
  );
}
