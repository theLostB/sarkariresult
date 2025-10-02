import type { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.resolve(process.cwd(), 'public', 'subscribers.json');

// VAPID keys (replace with your own for production)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

webpush.setVapidDetails(
  'mailto:admin@sarkariresults.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { title, body, url } = req.body;
    let subscribers: any[] = [];
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
    }
    const payload = JSON.stringify({
      title: title || 'Sarkari Results Update',
      body: body || 'New update available!',
      icon: '/icon-192x192.png',
      url: url || '/' 
    });
    await Promise.all(
      subscribers.map((sub) =>
        webpush.sendNotification(sub, payload).catch(() => null)
      )
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
