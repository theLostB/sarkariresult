import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "public", "data.json");

function readData() {
  const json = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(json);
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Helper to flatten eligibilityPosts into postName/postEligibility/postAgeLimit fields
function flattenEligibilityPosts(obj: any) {
  if (!Array.isArray(obj.eligibilityPosts)) return obj;
  const flat: Record<string, string> = {};
  obj.eligibilityPosts.forEach((post: { name: string; eligibility: string; ageLimit: string }, idx: number) => {
    const n = idx + 1;
    flat[`postName${n}`] = post.name || '';
    flat[`postEligibility${n}`] = post.eligibility || '';
    flat[`postAgeLimit${n}`] = post.ageLimit || '';
  });
  // Fill up to 10 posts with empty strings if not provided
  for (let i = obj.eligibilityPosts.length + 1; i <= 10; i++) {
    flat[`postName${i}`] = '';
    flat[`postEligibility${i}`] = '';
    flat[`postAgeLimit${i}`] = '';
  }
  // Remove eligibilityPosts array
  const { eligibilityPosts, ...rest } = obj;
  return { ...rest, ...flat };
}

export async function GET() {
  const data = readData();
  return NextResponse.json({ sarkariYojana: data.sarkariYojana || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = readData();
  if (!data.sarkariYojana) data.sarkariYojana = [];

  // Transform eligibilityPosts to flat fields
  const flatBody = flattenEligibilityPosts(body);

  if (body.id) {
    // Update
    const idx = data.sarkariYojana.findIndex((y: any) => y.id === body.id);
    if (idx !== -1) {
      data.sarkariYojana[idx] = { ...data.sarkariYojana[idx], ...flatBody };
      writeData(data);
      return NextResponse.json({ success: true, yojana: data.sarkariYojana[idx] });
    } else {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
  } else {
    // Create
    const maxId = data.sarkariYojana.reduce((max: number, y: any) => {
      const n = y.id && y.id.startsWith("yojana-") ? parseInt(y.id.replace("yojana-", "")) : 0;
      return n > max ? n : max;
    }, 0);
    const newId = `yojana-${maxId + 1}`;
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    const newYojana = { ...flatBody, id: newId, date: formattedDate };
    data.sarkariYojana.unshift(newYojana);
    writeData(data);
    return NextResponse.json({ success: true, yojana: newYojana });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }
  const data = readData();
  if (!data.sarkariYojana) data.sarkariYojana = [];
  const idx = data.sarkariYojana.findIndex((y: any) => y.id === id);
  if (idx === -1) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  data.sarkariYojana.splice(idx, 1);
  writeData(data);
  return NextResponse.json({ success: true });
}
