"use client";
import { useEffect, useState, use } from "react";
import AuthForm from "@/components/AuthForm";
import Keypad from "@/components/Keypad";

export default function GamePage({ params }) {
  const { id } = use(params);
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState("loading");
  const [value, setValue] = useState("");
  const [hint, setHint] = useState("");
  const [flash, setFlash] = useState(0);

  async function load() {
    const res = await fetch(`/api/games/${id}`);
    if (res.status === 401) return setStatus("login");
    if (!res.ok) return setStatus("missing");
    setGame(await res.json());
    setStatus("ready");
  }
  useEffect(() => { load(); }, [id]);

  async function submit() {
    if (value === "" || value === "-") return;
    const n = Number(value);
    if (n < game.min || n > game.max) return setHint(`Stay between ${game.min} and ${game.max}`);
    const res = await fetch(`/api/games/${id}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess: n }),
    });
    const data = await res.json();
    setValue("");
    setFlash(flash + 1);
    if (!res.ok) return setHint(data.error);
    if (data.result === "low") setHint(`▲ HIGHER than ${n}`);
    if (data.result === "high") setHint(`▼ LOWER than ${n}`);
    if (data.result === "correct") setHint("");
    load();
  }

  if (status === "loading") return <div className="wrap page muted">Opening the locker...</div>;
  if (status === "missing")
    return (
      <div className="wrap page">
        <h2>Puzzle not found</h2>
        <p className="muted" style={{ margin: "12px 0 20px" }}>This link may be wrong or the puzzle was removed.</p>
        <a className="btn" href="/dashboard">Go to your dashboard</a>
      </div>
    );
  if (status === "login")
    return (
      <div className="wrap page grid2">
        <div>
          <h1 style={{ fontSize: "clamp(40px,6vw,64px)" }}>Someone locked a number for you.</h1>
          <p className="muted" style={{ marginTop: 18 }}>Log in or sign up to start guessing.</p>
        </div>
        <AuthForm onDone={load} />
      </div>
    );

  const solved = game.mine?.solved;
  const locked = solved || game.isOwner;
  const line = solved ? `OPEN. Cracked in ${game.mine.tries} ${game.mine.tries === 1 ? "try" : "tries"}`
    : game.isOwner ? "Your lock. Share the link to play."
    : hint || `Pick a number from ${game.min} to ${game.max}`;
  const big = solved || game.isOwner ? game.secret : value || "—";

  return (
    <div className="wrap page">
      <div className="game">
        <h2 style={{ marginBottom: 6 }}>{game.title}</h2>
        <p className="muted" style={{ marginBottom: 22 }}>Locked by {game.owner}</p>

        <div className="door">
          <div key={flash} className={`lcd ${flash ? "flash" : ""}`} aria-live="polite">
            <div className="lcd-status">{line}</div>
            <div className="lcd-value">{big}</div>
          </div>
          <Keypad value={value} onChange={setValue} onSubmit={submit}
            maxLength={Math.max(String(Math.abs(game.min)).length, String(Math.abs(game.max)).length)}
            allowMinus={game.min < 0} disabled={locked} />
          {!locked && game.mine && <p className="muted" style={{ marginTop: 14, textAlign: "center" }}>Tries so far: {game.mine.tries}</p>}
        </div>
      </div>

      <div className="roster game" style={{ width: "min(560px,100%)" }}>
        {game.players ? (
          <>
            <h3>Roster</h3>
            {game.players.length === 0 && <p className="muted" style={{ marginTop: 10 }}>Nobody has tried yet.</p>}
            <ul>
              {game.players.map((p) => (
                <li key={p.username}>
                  <span>{p.username}</span>
                  {p.solved ? <span className="cracked">Cracked in {p.tries}</span>
                            : <span className="muted">Still guessing, {p.tries} tries</span>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted">Crack the lock to see who else has opened it.</p>
        )}
        <p style={{ marginTop: 24 }}><a href="/dashboard">Back to your lockers</a></p>
      </div>
    </div>
  );
}
