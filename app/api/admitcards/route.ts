import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data.json');

function readData() {
  const json = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(json);
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

function formatDate(dateObj: Date) {
  const d = dateObj.getDate().toString().padStart(2, '0');
  const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const y = dateObj.getFullYear();
  return `${d}-${m}-${y}`;
}

export async function POST(req: NextRequest) {
  const { jobId, title, url, description, date } = await req.json();
  if (!jobId) {
    return NextResponse.json({ success: false, error: 'Missing jobId' }, { status: 400 });
  }
  const data = readData();
  const admitCards = Array.isArray(data.admitCards) ? data.admitCards : [];
  let maxNum = 0;
  if (data.admitCards && Array.isArray(data.admitCards)) {
    data.admitCards.forEach((card: any) => {
      const match = typeof card.id === 'string' && card.id.match(/^admit-card-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
  }
  const nextNum = maxNum + 1;
  // Always save date as DD-MM-YYYY
  let finalDate = date;
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // Convert from YYYY-MM-DD to DD-MM-YYYY
    const [y, m, d] = date.split('-');
    finalDate = `${d}-${m}-${y}`;
  } else if (!date) {
    finalDate = formatDate(new Date());
  }
  const newAdmitCard = {
    id: `admit-card-${nextNum}`,
    jobId,
    title,
    url,
    description,
    date: finalDate,
  };
  admitCards.push(newAdmitCard);
  data.admitCards = admitCards;
  writeData(data);
  return NextResponse.json({ success: true, id: newAdmitCard.id });
}

export async function PATCH(req: NextRequest) {
  const { id, title, url, description, date } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  const data = readData();
  const admitCards = Array.isArray(data.admitCards) ? data.admitCards : [];
  const idx = admitCards.findIndex((a: any) => a.id === id);
  if (idx === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  const admitCard = admitCards[idx];
  if (title !== undefined) admitCard.title = title;
  if (url !== undefined) admitCard.url = url;
  if (description !== undefined) admitCard.description = description;
  if (date !== undefined) {
    // Always save date as DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // Convert from YYYY-MM-DD to DD-MM-YYYY
      const [y, m, d] = date.split('-');
      admitCard.date = `${d}-${m}-${y}`;
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      admitCard.date = date;
    } else if (date instanceof Date) {
      admitCard.date = formatDate(date);
    } else {
      admitCard.date = formatDate(new Date(date));
    }
  }
  data.admitCards = admitCards;
  writeData(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
  const data = readData();
  let admitCards = Array.isArray(data.admitCards) ? data.admitCards : [];
  const before = admitCards.length;
  admitCards = admitCards.filter((a: any) => a.id !== id);
  data.admitCards = admitCards;
  writeData(data);
  return NextResponse.json({ success: true, deleted: before - admitCards.length });
}
