import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  OrderData,
  OrderItem,
  addOrder,
  formatDate,
  formatPrice,
  getNextOrderId,
  getOrders
} from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ orders: getOrders() });
  }

  if (req.method === 'POST') {
    try {
      const { customerName, phone, address, notes, paymentMethod, items, totalPrice, chatId: customChatId } = req.body || {};

      const cleanPhoneDigits = (phone || "").replace(/\D/g, "");

      if (!customerName || !phone || cleanPhoneDigits.length < 9) {
        return res.status(400).json({ error: "Пожалуйста, укажите имя и полноценный номер телефона (например: +996 773 744 448)" });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Корзина пуста" });
      }

      const orderNum = getNextOrderId();
      const uniqueSuffix = Date.now().toString().slice(-4);
      const orderId = `#${orderNum}-${uniqueSuffix}`;
      const orderDate = new Date();
      const formattedDateStr = formatDate(orderDate);

      const calculatedTotal = totalPrice || items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);

      const newOrder: OrderData = {
        id: orderId,
        customerName,
        phone,
        address: address || "Не указан",
        notes: notes || "",
        paymentMethod: paymentMethod || "Наличными курьеру",
        items,
        totalPrice: calculatedTotal,
        createdAt: orderDate.toISOString()
      };

      // Construct Telegram Message in Russian
      let messageLines: string[] = [];
      messageLines.push(`🛒 Новый заказ ${orderId}\n`);
      messageLines.push(`👤 ${customerName}`);
      messageLines.push(`📞 ${phone}`);
      messageLines.push(`📍 ${address || "Бишкек"}`);
      if (notes && typeof notes === "string" && notes.trim() !== "") {
        messageLines.push(`📝 ${notes.trim()}`);
      }
      messageLines.push(``);
      messageLines.push(`📦 Продукты:`);
      items.forEach((item: OrderItem) => {
        messageLines.push(`• ${item.title} × ${item.quantity}`);
      });
      messageLines.push(``);
      messageLines.push(`💰 Сумма: ${formatPrice(calculatedTotal)} сом`);
      messageLines.push(``);
      messageLines.push(`🕒 Дата: ${formattedDateStr}`);

      const telegramMessage = messageLines.join("\n");

      // Telegram Bot credentials from environment variables ONLY
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      let chatId = customChatId || process.env.TELEGRAM_CHAT_ID;

      let telegramStatus: 'sent' | 'failed' | 'not_configured' = 'not_configured';
      let telegramErrorMsg: string | undefined;

      if (botToken && chatId) {
        try {
          let tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: telegramMessage
            })
          });
          let tgResult = await tgResponse.json();

          // If Telegram migrated the group chat to a supergroup, retry with the migrated chat ID
          if (!tgResult.ok && tgResult.parameters && tgResult.parameters.migrate_to_chat_id) {
            const newChatId = String(tgResult.parameters.migrate_to_chat_id);
            console.log(`Telegram group migrated to supergroup ${newChatId}. Retrying order notification...`);
            process.env.TELEGRAM_CHAT_ID = newChatId;
            chatId = newChatId;

            tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage
              })
            });
            tgResult = await tgResponse.json();
          }

          if (tgResponse.ok && tgResult.ok) {
            telegramStatus = 'sent';
            console.log(`Telegram notification sent successfully to group ${chatId} for Order ${orderId}`);
          } else {
            telegramStatus = 'failed';
            telegramErrorMsg = tgResult.description || "Telegram API error";
            console.error(`Telegram notification failed for Order ${orderId}:`, tgResult);
          }
        } catch (err: any) {
          telegramStatus = 'failed';
          telegramErrorMsg = err.message || "Failed to reach Telegram API";
          console.error(`Error calling Telegram API for Order ${orderId}:`, err);
        }
      } else {
        console.warn(`Telegram token or chat ID not configured. Order ${orderId} saved locally.`);
      }

      newOrder.telegramStatus = telegramStatus;
      if (telegramErrorMsg) {
        newOrder.telegramError = telegramErrorMsg;
      }

      addOrder(newOrder);

      return res.status(201).json({
        success: true,
        order: newOrder,
        telegramSent: telegramStatus === 'sent',
        telegramStatus,
        message: "Order placed successfully"
      });
    } catch (error: any) {
      console.error("Order processing error:", error);
      return res.status(500).json({ error: "Failed to place order" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
