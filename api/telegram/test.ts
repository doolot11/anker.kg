import type { VercelRequest, VercelResponse } from '@vercel/node';
import { formatDate } from '../_utils';

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
  const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;
  const botToken = "8745284079:AAGRH7gKTvyqZfPX1cEQcNsBm553Ss1I0Kk";

  if (!botToken) {
    return res.status(500).json({ success: false, error: "TELEGRAM_BOT_TOKEN environment variable is not configured" });
  }

  if (!targetChatId) {
    return res.status(400).json({ success: false, error: "Chat ID is required" });
  }

  try {
    const testMsg = `🔔 Тестовое сообщение от бота ANKER.KG\n\nБот успешно подключен!\n🕒 ${formatDate(new Date())}`;
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: testMsg
      })
    });

    const result = await response.json();
    if (response.ok && result.ok) {
      return res.status(200).json({ success: true, message: "Test message sent to Telegram successfully!" });
    } else {
      return res.status(400).json({ success: false, error: result.description || "Telegram error" });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
