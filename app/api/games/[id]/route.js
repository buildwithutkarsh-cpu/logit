import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET(req, { params }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return Response.json({ error: "Log in first" }, { status: 401 });

  let _id;
  try { _id = new ObjectId(id); } catch { return Response.json({ error: "Game not found" }, { status: 404 }); }

  const d = await db();
  const game = await d.collection("games").findOne({ _id });
  if (!game) return Response.json({ error: "Game not found" }, { status: 404 });

  const mine = await d.collection("plays").findOne({ gameId: id, username: user });
  const isOwner = game.owner === user;
  const canSee = isOwner || mine?.solved;

  let players = null;
  if (canSee) {
    const all = await d.collection("plays").find({ gameId: id }).sort({ solvedAt: 1 }).toArray();
    players = all.map((p) => ({ username: p.username, tries: p.tries, solved: !!p.solved }));
  }

  return Response.json({
    id, title: game.title, owner: game.owner, min: game.min, max: game.max, isOwner,
    mine: mine ? { tries: mine.tries, solved: !!mine.solved } : null,
    players,
    secret: canSee ? game.secret : undefined,
  });
}
