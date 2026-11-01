"use client";
import { useEffect, useState } from "react";
import AuthForm from "@/components/AuthForm";

export default function Dashboard() {
  const [user, setUser] = useState(undefined);
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({ title: "", min: 1, max: 100, secret: "" });
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const [copied, setCopied] = useState("");

  async function loadGames() {
    const res = await fetch("/api/games");
    if (res.ok) setGames((await res.json()).games);
  }

  useEffect(() => {
    fetch("/api/auth").then((r) => r.json()).then((d) => {
      setUser(d.username);
      if (d.username) loadGames();
    });
  }, []);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setUser(null); setGames([]); setCreated("");
  }

  async function create(e) {
    e.preventDefault();
    setError(""); setCreated("");
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setCreated(`${location.origin}/game/${data.id}`);
    setForm({ ...form, title: "", secret: "" });
    loadGames();
  }

  async function copy(link) {
    await navigator.clipboard.writeText(link);
    setCopied(link);
    setTimeout(() => setCopied(""), 1800);
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (user === undefined) return <div className="wrap page muted">Loading your lockers...</div>;

  if (!user)
    return (
      <div className="wrap page grid2">
        <div>
          <h1 style={{ fontSize: "clamp(40px,6vw,64px)" }}>Open your locker.</h1>
          <p className="muted" style={{ marginTop: 18, maxWidth: "28em" }}>
            Log in to create puzzles, share them, and see who cracked them. You can join with just a username and password.
          </p>
        </div>
        <AuthForm onDone={(u) => { setUser(u); loadGames(); }} />
      </div>
    );

  return (
    <div className="wrap page">
      <div className="topline">
        <h2>Your lockers</h2>
        <div className="row" style={{ flex: "none", alignItems: "center" }}>
          <span className="muted">Signed in as <b>{user}</b></span>
          <button className="btn btn-ghost" style={{ padding: "8px 14px" }} onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="grid2">
        <form onSubmit={create} className="door plain stack">
          <h3>New puzzle</h3>
          <label>Title (optional)
            <input value={form.title} onChange={set("title")} placeholder="Guess my lucky number" />
          </label>
          <div className="row">
            <label>Lowest
              <input type="number" value={form.min} onChange={set("min")} />
            </label>
            <label>Highest
              <input type="number" value={form.max} onChange={set("max")} />
            </label>
          </div>
          <label>Secret number
            <input type="number" value={form.secret} onChange={set("secret")} />
          </label>
          <button className="btn">Lock it</button>
          {error && <p className="err">{error}</p>}
        </form>

        <div>
          {created ? (
            <div className="callout" style={{ marginTop: 0 }}>
              <p><b>Locked.</b> Send this link to your players:</p>
              <p style={{ margin: "8px 0 12px" }}><a href={created}>{created}</a></p>
              <button className="btn" onClick={() => copy(created)}>{copied === created ? "Copied" : "Copy link"}</button>
            </div>
          ) : (
            <p className="muted">
              Choose a range, set a secret number, and Logit gives you a link. Players only see
              higher or lower hints. They never see the number until they crack it.
            </p>
          )}
        </div>
      </div>

      <div className="lockers">
        {games.length === 0 && <p className="muted">No puzzles yet. Lock your first number above.</p>}
        {games.map((g, i) => {
          const link = `${typeof location !== "undefined" ? location.origin : ""}/game/${g.id}`;
          return (
            <div className="door locker-card" key={g.id}>
              <span className="num">No. {games.length - i}</span>
              <h3>{g.title}</h3>
              <p className="meta">Range {g.min} to {g.max}. {g.players} played, {g.solved} cracked.</p>
              <div className="row">
                <a href={`/game/${g.id}`} className="btn">Open</a>
                <button className="btn btn-ghost" onClick={() => copy(link)}>{copied === link ? "Copied" : "Copy link"}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
