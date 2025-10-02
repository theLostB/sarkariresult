import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "data.json");
const SCHOLARSHIP_KEY = "scholarshipTests";

async function readData() {
  const file = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(file);
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = await readData();
  return NextResponse.json({ scholarships: data[SCHOLARSHIP_KEY] || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = await readData();
  let scholarships = Array.isArray(data[SCHOLARSHIP_KEY]) ? data[SCHOLARSHIP_KEY] : [];
  if (body.id) {
    // Update existing
    const idx = scholarships.findIndex((s: any) => s.id === body.id);
    if (idx !== -1) {
      scholarships[idx] = { ...scholarships[idx], ...body };
    } else {
      scholarships.push(body);
    }
  } else {
    // New scholarship, assign id and date
    // Find max numeric id in existing scholarships
    let maxId = 0;
    scholarships.forEach((s: any) => {
      const match = typeof s.id === 'string' && s.id.match(/^scholarship-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxId) maxId = num;
      }
      const match2 = typeof s.id === 'string' && s.id.match(/^scholarship_(\d+)$/);
      if (match2) {
        const num = parseInt(match2[1], 10);
        if (num > maxId) maxId = num;
      }
      const match3 = typeof s.id === 'string' && s.id.match(/^scholarship-(\d+)$/);
      if (match3) {
        const num = parseInt(match3[1], 10);
        if (num > maxId) maxId = num;
      }
      const match4 = typeof s.id === 'string' && s.id.match(/^scholarship_(\d+)$/);
      if (match4) {
        const num = parseInt(match4[1], 10);
        if (num > maxId) maxId = num;
      }
    });
    body.id = `scholarship-${maxId + 1}`;
    // Set current date in DD-MM-YYYY format
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    body.date = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    scholarships.push(body);
  }
  data[SCHOLARSHIP_KEY] = scholarships;
  await writeData(data);
  return NextResponse.json({ success: true, id: body.id });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data = await readData();
  let scholarships = Array.isArray(data[SCHOLARSHIP_KEY]) ? data[SCHOLARSHIP_KEY] : [];
  scholarships = scholarships.filter((s: any) => s.id !== id);
  data[SCHOLARSHIP_KEY] = scholarships;
  await writeData(data);
  return NextResponse.json({ success: true });
}
