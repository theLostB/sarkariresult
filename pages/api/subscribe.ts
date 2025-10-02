import type { NextApiRequest, NextApiResponse } from 'next';

// In production, use a real DB. Here, store in a JSON file for demo.
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.resolve(process.cwd(), 'public', 'subscribers.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const subscription = req.body;
    let subscribers: any[] = [];
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
    }
    // Prevent duplicate subscriptions
    if (!subscribers.find((s) => s.endpoint === subscription.endpoint)) {
      subscribers.push(subscription);
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    }
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save subscription' });
  }
}
