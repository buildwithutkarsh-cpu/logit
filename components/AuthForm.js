"use client";
import { useState } from "react";

export default function AuthForm({ onDone }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, username, password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    onDone(data.username);
  }

  return (
    <form onSubmit={submit} className="door plain stack">
      <h3>{mode === "login" ? "Log in" : "Create account"}</h3>
      <label>Username
        <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>Password
        <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button className="btn">{mode === "login" ? "Log in" : "Sign up"}</button>
      {error && <p className="err">{error}</p>}
      <p className="muted">
        {mode === "login" ? "New to Logit? " : "Already have an account? "}
        <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === "login" ? "register" : "login"); }}>
          {mode === "login" ? "Create an account" : "Log in"}
        </a>
      </p>
    </form>
  );
}
