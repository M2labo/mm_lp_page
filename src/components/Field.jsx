import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-md p-3 bg-white text-black placeholder-gray-400 shadow-sm " +
        "focus:outline-none focus:ring-2 focus:ring-[#cddc39] " + className
      }
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={
        "w-full rounded-md p-3 bg-white text-black placeholder-gray-400 shadow-sm " +
        "focus:outline-none focus:ring-2 focus:ring-[#cddc39] " + className
      }
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={
        "w-full rounded-md p-3 bg-white text-black shadow-sm " +
        "focus:outline-none focus:ring-2 focus:ring-[#cddc39] " + className
      }
      {...props}
    >
      {children}
    </select>
  );
}
