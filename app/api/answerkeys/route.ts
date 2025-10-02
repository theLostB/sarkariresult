import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const DATA_FILE = path.join(process.cwd(), 'public', 'data.json');

export async function POST(req: NextRequest) {
  try {
    const { jobId, title, description, url } = await req.json();
    // Only jobId is required, other fields can be empty
    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Missing job ID' }, { status: 400 });
    }
    // If any field is missing, set as empty string
    const safeTitle = typeof title === 'string' ? title : '';
    const safeDescription = typeof description === 'string' ? description : '';
    const safeUrl = typeof url === 'string' ? url : '';
    let data;
    try {
      const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(dataRaw);
    } catch (err) {
      data = { jobs: [], results: [], answerKeys: [] };
    }
    if (!Array.isArray(data.answerKeys)) data.answerKeys = [];

    // Auto-generate answer key id in format 'answer-key-1', 'answer-key-2', ...
    const maxId = data.answerKeys.reduce((max: number, r: any) => {
      const m = typeof r.id === 'string' ? r.id.match(/answer-key-(\d+)/) : null;
      return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);
    const answerKeyId = `answer-key-${maxId + 1}`;

    // Add current date
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const date = `${dd}-${mm}-${yyyy}`;

    const newAnswerKey = {
      id: answerKeyId,
      jobId,
      title: safeTitle,
      description: safeDescription,
      url: safeUrl,
      date
    };
    data.answerKeys.unshift(newAnswerKey);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, answerKey: newAnswerKey, created: true });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, title, description, url } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing answerkey id' }, { status: 400 });
    }
    let data;
    try {
      const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(dataRaw);
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to read data.json' }, { status: 500 });
    }
    if (!Array.isArray(data.answerKeys)) data.answerKeys = [];
    const idx = data.answerKeys.findIndex((r: any) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Answer key not found' }, { status: 404 });
    }
    // Update fields with provided values (can be empty strings)
    data.answerKeys[idx].title = typeof title === 'string' ? title : '';
    data.answerKeys[idx].description = typeof description === 'string' ? description : '';
    data.answerKeys[idx].url = typeof url === 'string' ? url : '';
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, answerKey: data.answerKeys[idx], updated: true });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    let id = '';
    // Try to get id from query param
    const url = new URL(req.url);
    id = url.searchParams.get('id') || '';
    // If not in query, try to get from body
    if (!id) {
      try {
        const body = await req.json();
        id = body.id || '';
      } catch {}
    }
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing answerkey id' }, { status: 400 });
    }
    let data;
    try {
      const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(dataRaw);
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to read data.json' }, { status: 500 });
    }
    if (!Array.isArray(data.answerKeys)) data.answerKeys = [];
    const initialLength = data.answerKeys.length;
    data.answerKeys = data.answerKeys.filter((r: any) => r.id !== id);
    if (data.answerKeys.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Answer key not found' }, { status: 404 });
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}