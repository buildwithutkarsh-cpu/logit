import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(req) {
  const user = await getUser();
  if (!user) return Response.json({ error: "Log in first" }, { status: 401 });

  const b = await req.json();
  const min = Number(b.min), max = Number(b.max), secret = Number(b.secret);
  const title = String(b.title || "").trim().slice(0, 40) || "Untitled puzzle";

  if (![min, max, secret].every(Number.isInteger))
    return Response.json({ error: "Min, max and the secret must be whole numbers" }, { status: 400 });
  if (min >= max || max - min > 1_000_000_000)
    return Response.json({ error: "Min must be smaller than max (range up to 1 billion)" }, { status: 400 });
  if (secret < min || secret > max)
    return Response.json({ error: "The secret number must be inside your range" }, { status: 400 });

  const r = await (await db()).collection("games").insertOne({
    owner: user, title, min, max, secret, createdAt: new Date(),
  });
  return Response.json({ id: r.insertedId.toString() });
}

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ error: "Log in first" }, { status: 401 });

  const d = await db();
  const games = await d.collection("games").find({ owner: user }).sort({ createdAt: -1 }).toArray();
  const out = [];
  for (const g of games) {
    const id = g._id.toString();
    const players = await d.collection("plays").countDocuments({ gameId: id });
    const solved = await d.collection("plays").countDocuments({ gameId: id, solved: true });
    out.push({ id, title: g.title, min: g.min, max: g.max, players, solved });
  }
  return Response.json({ games: out });
}
