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
    let data;
    try {
      const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(dataRaw);
    } catch (err) {
      data = { jobs: [], results: [] };
    }
    if (!Array.isArray(data.results)) data.results = [];

    // Auto-generate result id
    const maxId = data.results.reduce((max: number, r: any) => {
      const m = typeof r.id === 'string' ? r.id.match(/result_(\d+)/) : null;
      return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);
    const resultId = `result_${maxId + 1}`;

    // Add current date
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const date = `${dd}-${mm}-${yyyy}`;

    const newResult = {
      id: resultId,
      jobId,
      title,
      description,
      url,
      date
    };
    data.results.unshift(newResult);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, result: newResult, created: true });
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
      return NextResponse.json({ success: false, error: 'Missing result id' }, { status: 400 });
    }
    let data;
    try {
      const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(dataRaw);
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to read data.json' }, { status: 500 });
    }
    if (!Array.isArray(data.results)) data.results = [];
    const idx = data.results.findIndex((r: any) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }
    // Update fields with provided values (can be empty strings)
    data.results[idx].title = typeof title === 'string' ? title : '';
    data.results[idx].description = typeof description === 'string' ? description : '';
    data.results[idx].url = typeof url === 'string' ? url : '';
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, result: data.results[idx], updated: true });
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
      return NextResponse.json({ success: false, error: 'Missing result id' }, { status: 400 });
    }
    let data;
    try {
      const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(dataRaw);
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to read data.json' }, { status: 500 });
    }
    if (!Array.isArray(data.results)) data.results = [];
    const initialLength = data.results.length;
    data.results = data.results.filter((r: any) => r.id !== id);
    if (data.results.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
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
