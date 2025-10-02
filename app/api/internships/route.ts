import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'public', 'data.json');

export async function POST(req: NextRequest) {
  try {
    const newInternshipRaw = await req.json();
    // Remove empty fields
    const newInternship = Object.fromEntries(Object.entries(newInternshipRaw).filter(([_, v]) => v !== ""));
    if (!('title' in newInternship)) newInternship.title = "";
    const jsonData = await fs.readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(jsonData);
    if (!Array.isArray(data.internships)) data.internships = [];
    // If id is present, update the existing internship
    if (newInternship.id) {
      const idx = data.internships.findIndex((item: any) => item.id === newInternship.id);
      if (idx !== -1) {
        // Preserve id and date if not sent from frontend
        data.internships[idx] = {
          ...data.internships[idx],
          ...newInternship,
          id: data.internships[idx].id,
          date: data.internships[idx].date
        };
        await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
        return NextResponse.json({ success: true, internship: data.internships[idx], updated: true });
      }
      // If id not found, fallback to add new below
    }
    // Else, add as new
    const nextIdNum = data.internships.length + 1;
    const internshipId = `internship-${nextIdNum}`;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${pad(now.getDate())}-${pad(now.getMonth()+1)}-${now.getFullYear()}`;
    const internshipWithMeta = { ...newInternship, id: internshipId, date: dateStr };
    data.internships.push(internshipWithMeta);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, internship: internshipWithMeta, created: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const jsonData = await fs.readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(jsonData);
    return NextResponse.json({ success: true, internships: data.internships || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }
    const jsonData = await fs.readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(jsonData);
    if (!Array.isArray(data.internships)) data.internships = [];
    const originalLength = data.internships.length;
    data.internships = data.internships.filter((item: any) => item.id !== id);
    if (data.internships.length === originalLength) {
      return NextResponse.json({ success: false, error: 'Internship not found' }, { status: 404 });
    }
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
