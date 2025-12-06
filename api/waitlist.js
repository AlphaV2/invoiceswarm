import { Redis } from '@upstash/redis';

// 1. Connect to the database using the keys Vercel gave you
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    // 2. Add email to the "waitlist_emails" list (sadd prevents duplicates)
    await redis.sadd('waitlist_emails', email);
    
    // 3. Optional: Store the exact time they joined
    await redis.hset(`user:${email}`, {
        joinedAt: new Date().toISOString(),
        source: 'hero_section'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: 'Failed to join waitlist' });
  }
}