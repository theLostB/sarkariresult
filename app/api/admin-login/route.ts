import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const username = process.env.ADMIN_USERNAME;
const passwordHash = process.env.ADMIN_PASSWORD_HASH;
const jwtSecret = process.env.JWT_SECRET as string;

// For demo: Plaintext password check. For prod: use bcrypt.compare
export async function POST(req: NextRequest) {
  const { username: user, password } = await req.json();
  if (!user || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }
  if (user !== username || password !== passwordHash) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  // Authenticated: Sign a JWT
  const token = jwt.sign({ user }, jwtSecret, { expiresIn: "2h" });
  cookies().set("sarkari_admin_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  return NextResponse.json({ success: true });
}

export async function GET() {
  // For logout: clear cookie
  cookies().set("sarkari_admin_token", "", { maxAge: 0, path: "/" });
  return NextResponse.json({ success: true });
}
