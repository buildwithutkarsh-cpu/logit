import Link from "next/link";
import DemoLocker from "@/components/DemoLocker";

const steps = [
  { t: "Set the lock", d: "Pick a range and a secret number. Only you and the server know it." },
  { t: "Send the key", d: "Share your puzzle's link. Anyone with an account can try to crack it." },
  { t: "Check the roster", d: "Once someone cracks it, they and you see who opened it and who is still stuck." },
];

export default function Landing() {
  return (
    <>
      <section className="wrap hero">
        <div>
          <h1>Hide a number. Send the link. See who cracks it.</h1>
          <p className="lead">
            Logit turns a number into a lock. Set a secret, share one link, and your friends
            guess with higher or lower hints until the door opens.
          </p>
          <div className="cta">
            <Link href="/dashboard" className="btn">Make a puzzle</Link>
            <Link href="/dashboard" className="btn btn-ghost">Log in</Link>
          </div>
        </div>
        <DemoLocker />
      </section>

      <section className="wrap" style={{ paddingBottom: 24 }}>
        <h2>How it works</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li className="step" key={s.t}>
              <div className="n">{i + 1}</div>
              <h3>{s.t}</h3>
              <p className="muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap final">
        <h2>Your locker is empty.</h2>
        <Link href="/dashboard" className="btn">Make your first puzzle</Link>
      </section>

      <footer>Logit. Built with Next.js and MongoDB.</footer>
    </>
  );
}
