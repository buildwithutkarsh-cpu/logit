import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function POST(req, { params }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return Response.json({ error: "Log in first" }, { status: 401 });

  let _id;
  try { _id = new ObjectId(id); } catch { return Response.json({ error: "Game not found" }, { status: 404 }); }

  const d = await db();
  const game = await d.collection("games").findOne({ _id });
  if (!game) return Response.json({ error: "Game not found" }, { status: 404 });
  if (game.owner === user)
    return Response.json({ error: "This is your puzzle. Share the link so others can guess." }, { status: 400 });

  const n = Number((await req.json()).guess);
  if (!Number.isInteger(n)) return Response.json({ error: "Enter a whole number" }, { status: 400 });

  const plays = d.collection("plays");
  const existing = await plays.findOne({ gameId: id, username: user });
  if (existing?.solved) return Response.json({ result: "correct", tries: existing.tries });

  const solved = n === game.secret;
  const update = { $inc: { tries: 1 }, $setOnInsert: { createdAt: new Date() } };
  if (solved) update.$set = { solved: true, solvedAt: new Date() };
  await plays.updateOne({ gameId: id, username: user }, update, { upsert: true });

  const tries = (existing?.tries || 0) + 1;
  const result = solved ? "correct" : n < game.secret ? "low" : "high";
  return Response.json({ result, tries });
}
