import React from "react";

// bg="dark" | "darker" | "light" を想定
export default function Section({ id, bg = "dark", className = "", children }) {
  const bgClass =
    bg === "light" ? "bg-zinc-900/80" :
    bg === "darker" ? "bg-black/80" : "bg-zinc-900/80";
  return (
    <section id={id} className={`py-24 ${bgClass} ${className}`}>
      <div className="relative z-[80] max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
}
