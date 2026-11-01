import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function setSession(username) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key());
  (await cookies()).set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getUser() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload.username;
  } catch {
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete("session");
}
