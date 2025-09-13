import React from "react";

export default function Button({ children, className = "", ...rest }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm md:text-base font-medium " +
        "bg-[#cddc39] text-black shadow-xl hover:brightness-110 hover:shadow-2xl transition " +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}
