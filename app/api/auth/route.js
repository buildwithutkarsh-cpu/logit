import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setSession, getUser, clearSession } from "@/lib/auth";

export async function GET() {
  return Response.json({ username: await getUser() });
}

export async function DELETE() {
  await clearSession();
  return Response.json({ ok: true });
}

export async function POST(req) {
  const { mode, username, password } = await req.json();
  const name = String(username || "").trim().toLowerCase();
  const pass = String(password || "");

  if (!/^[a-z0-9_]{3,20}$/.test(name))
    return Response.json({ error: "Username: 3-20 letters, numbers or _" }, { status: 400 });
  if (pass.length < 6)
    return Response.json({ error: "Password needs at least 6 characters" }, { status: 400 });

  const users = (await db()).collection("users");

  if (mode === "register") {
    try {
      await users.insertOne({ username: name, hash: await bcrypt.hash(pass, 10), createdAt: new Date() });
    } catch {
      return Response.json({ error: "That username is taken" }, { status: 409 });
    }
  } else {
    const user = await users.findOne({ username: name });
    if (!user || !(await bcrypt.compare(pass, user.hash)))
      return Response.json({ error: "Wrong username or password" }, { status: 401 });
  }

  await setSession(name);
  return Response.json({ username: name });
}
