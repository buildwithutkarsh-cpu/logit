"use client";
import { useEffect, useState } from "react";
import Keypad from "./Keypad";

const MIN = 1, MAX = 100;
const randomSecret = () => Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

export default function DemoLocker() {
  const [secret, setSecret] = useState(null);
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState(`Pick a number from ${MIN} to ${MAX}`);
  const [solved, setSolved] = useState(false);
  const [flash, setFlash] = useState(0);

  useEffect(() => setSecret(randomSecret()), []);

  function submit() {
    if (secret === null || solved || value === "" || value === "-") return;
    const n = Number(value);
    if (n < MIN || n > MAX) return setStatus(`Stay between ${MIN} and ${MAX}`);
    const t = tries + 1;
    setTries(t);
    setFlash(flash + 1);
    if (n === secret) { setSolved(true); setStatus(`OPEN. Cracked in ${t} ${t === 1 ? "try" : "tries"}`); }
    else if (n < secret) setStatus(`▲ HIGHER than ${n}`);
    else setStatus(`▼ LOWER than ${n}`);
    setValue("");
  }

  function reset() {
    setSecret(randomSecret()); setValue(""); setTries(0); setSolved(false);
    setStatus(`Pick a number from ${MIN} to ${MAX}`);
  }

  return (
    <div className="demo-wrap">
      <div className="door">
        <div key={flash} className={`lcd ${flash ? "flash" : ""}`} aria-live="polite">
          <div className="lcd-status">{status}</div>
          <div className="lcd-value">{solved ? secret : value || "—"}</div>
        </div>
        <Keypad value={value} onChange={setValue} onSubmit={submit} maxLength={3} disabled={solved} />
        {solved && <button className="btn" style={{ width: "100%", marginTop: 14 }} onClick={reset}>Lock it again</button>}
      </div>
      <p className="demo-note muted">Try it now. This lock is a demo, so it picks a new number each visit.</p>
    </div>
  );
}
