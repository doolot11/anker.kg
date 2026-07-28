import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { chatId } = req.body || {};
  if (typeof chatId === "string") {
    process.env.TELEGRAM_CHAT_ID = chatId.trim();
    return res.status(200).json({ success: true, chatId: process.env.TELEGRAM_CHAT_ID });
  }

  return res.status(400).json({ error: "Invalid Chat ID" });
}
