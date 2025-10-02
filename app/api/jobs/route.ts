import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const DATA_FILE = path.join(process.cwd(), 'public', 'data.json');

export async function GET() {
  try {
    const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(dataRaw);
    if (!Array.isArray(data.jobs)) data.jobs = [];
    return NextResponse.json({ jobs: data.jobs });
  } catch (err) {
    return NextResponse.json({ jobs: [] });
  }
}

export async function POST(req: NextRequest) {
  // Helper: Update coachingInstitutes.json for this job
  async function updateCoachingInstitutes(jobTitle: string, job: any) {
    const COACHING_FILE = path.join(process.cwd(), 'public', 'coachingInstitutes.json');
    let coachingData: { [key: string]: { name: string; url: string }[] } = {};
    try {
      const coachingRaw = await fs.readFile(COACHING_FILE, 'utf-8');
      coachingData = JSON.parse(coachingRaw);
    } catch (e) { coachingData = {}; }
    // Collect all non-empty coachingNameX + coachingUrlX pairs
    const institutes = [];
    for (let i = 1; i <= 5; i++) {
      const name = job[`coachingName${i}`];
      const url = job[`coachingUrl${i}`];
      if (name?.trim() && url?.trim()) {
        institutes.push({ name, url });
      }
    }
    if (institutes.length > 0) {
      coachingData[jobTitle] = institutes;
    } else {
      // Remove if exists and all are empty
      if (coachingData[jobTitle]) delete coachingData[jobTitle];
    }
    await fs.writeFile(COACHING_FILE, JSON.stringify(coachingData, null, 2), 'utf-8');
  }
  try {
    const job = await req.json();
    let data;
    try {
      const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(dataRaw);
    } catch (err) {
      data = { jobs: [] };
    }
    if (!Array.isArray(data.jobs)) data.jobs = [];

    // Generate unique id if missing
    let jobToSave = { ...job };
    // Move jobName to title
    if (jobToSave.jobName) {
      jobToSave.title = jobToSave.jobName;
      delete jobToSave.jobName;
    }
    // Remove deprecated importantLink fields
    delete jobToSave.importantLinkApply;
    delete jobToSave.importantLinkNotification;
    delete jobToSave.importantLinkOfficial;
    // Encode Sate Gov as state%20gov
    if (jobToSave.category === 'Sate Gov') {
      jobToSave.category = 'state%20gov';
    }
    // Add current date if not present
    if (!jobToSave.date) {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      jobToSave.date = `${dd}-${mm}-${yyyy}`;
    }
    if (jobToSave.id) {
      // Update coaching institutes for this job title
      await updateCoachingInstitutes(jobToSave.title, jobToSave);
      // Update existing job if id matches
      const idx = data.jobs.findIndex((j: any) => j.id === jobToSave.id);
      if (idx !== -1) {
        // Overwrite all eligibility fields (postNameX, postEligibilityX, postAgeLimitX)
        for (let i = 1; i <= 10; i++) {
          data.jobs[idx][`postName${i}`] = jobToSave[`postName${i}`] || "";
          data.jobs[idx][`postEligibility${i}`] = jobToSave[`postEligibility${i}`] || "";
          data.jobs[idx][`postAgeLimit${i}`] = jobToSave[`postAgeLimit${i}`] || "";
        }
        // If resultTitle/resultDescription/resultUrl are present in request, update them in the job object
        if (typeof job.resultTitle === 'string') data.jobs[idx].resultTitle = job.resultTitle;
        if (typeof job.resultDescription === 'string') data.jobs[idx].resultDescription = job.resultDescription;
        if (typeof job.resultUrl === 'string') data.jobs[idx].resultUrl = job.resultUrl;
        data.jobs[idx] = { ...data.jobs[idx], ...jobToSave };
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return NextResponse.json({ success: true, job: data.jobs[idx], updated: true });
      } else {
        // If id provided but not found, treat as new
        data.jobs.unshift(jobToSave);
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return NextResponse.json({ success: true, job: jobToSave, created: true });
      }
    } else {
      const maxId = data.jobs.reduce((max: number, j: any) => {
        const m = typeof j.id === 'string' ? j.id.match(/jobs_(\d+)/) : null;
        return m ? Math.max(max, parseInt(m[1], 10)) : max;
      }, 0);
      jobToSave.id = `jobs_${maxId + 1}`;
      data.jobs.unshift(jobToSave);
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, job: jobToSave, created: true });
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
      return NextResponse.json({ success: false, error: 'Missing job id' }, { status: 400 });
    }
    const dataRaw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(dataRaw);
    if (!Array.isArray(data.jobs)) data.jobs = [];
    const initialLength = data.jobs.length;
    // Find the job being deleted (to get its title)
    const jobToDelete = data.jobs.find((job: any) => job.id === id);
    const jobTitle = jobToDelete?.title;
    data.jobs = data.jobs.filter((job:any) => job.id !== id);
    if (data.jobs.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Remove from coachingInstitutes.json if present
    if (jobTitle) {
      const COACHING_FILE = path.join(process.cwd(), 'public', 'coachingInstitutes.json');
      let coachingData: { [key: string]: { name: string; url: string }[] } = {};
      try {
        const coachingRaw = await fs.readFile(COACHING_FILE, 'utf-8');
        coachingData = JSON.parse(coachingRaw);
      } catch (e) { coachingData = {}; }
      // Normalize function for keys
      const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
      const normalizedJobTitle = normalize(jobTitle);
      // Try to find exact or fuzzy match
      let foundKey = Object.keys(coachingData).find(
        key => normalize(key) === normalizedJobTitle
      );
      if (!foundKey) {
        // Try partial/fuzzy match (e.g. ignoring extra spaces/case)
        foundKey = Object.keys(coachingData).find(
          key => normalize(key).includes(normalizedJobTitle) || normalizedJobTitle.includes(normalize(key))
        );
      }
      if (foundKey) {
        delete coachingData[foundKey];
        await fs.writeFile(COACHING_FILE, JSON.stringify(coachingData, null, 2), 'utf-8');
      }
    }
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


