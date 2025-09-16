import React from "react";

// bg="dark" | "darker" | "light" を想定
export default function Section({ id, bg = "dark", className = "", children }) {
  const bgClass =
    bg === "light"   ? "bg-white" :
    bg === "darker"  ? "bg-zinc-100" :
                       "bg-zinc-50";
  return (
    <section id={id} className={`py-24 ${bgClass} ${className}`}>
      <div className="relative z-[80] max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
}
