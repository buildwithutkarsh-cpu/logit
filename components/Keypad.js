"use client";
import { useEffect } from "react";

export default function Keypad({ value, onChange, onSubmit, maxLength = 10, allowMinus = false, disabled = false }) {
  function press(k) {
    if (disabled) return;
    if (k === "C") return onChange("");
    if (k === "OK") return onSubmit();
    if (k === "-") return onChange(value.startsWith("-") ? value.slice(1) : "-" + value);
    if (value.replace("-", "").length >= maxLength) return;
    onChange(value + k);
  }

  useEffect(() => {
    function onKey(e) {
      if (disabled || e.target.tagName === "INPUT") return;
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") onChange(value.slice(0, -1));
      else if (e.key === "Enter") onSubmit();
      else if (e.key === "-" && allowMinus) press("-");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"];
  return (
    <div className="keypad">
      {keys.map((k) => (
        <button key={k} type="button" disabled={disabled} className={k === "OK" ? "go" : ""} onClick={() => press(k)}>
          {k}
        </button>
      ))}
      {allowMinus && (
        <button type="button" disabled={disabled} className="wide" onClick={() => press("-")}>+ / -</button>
      )}
    </div>
  );
}
