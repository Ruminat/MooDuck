import TelegramBot from "node-telegram-bot-api";
import { TelegramKeyboard } from "./keyboard/definitions";

export function telegramOnCallbackQuery(bot: TelegramBot): void {
  bot.on("callback_query", (query) => {
    const message = query.message;
    const messageId = query.message?.message_id;
    const chatId = message?.chat.id;
    const data = query.data;

    console.log("Callback query received:", { queryId: query.id, messageId, chatId, data });

    if (!chatId || !messageId) return;

    switch (data) {
      case TelegramKeyboard.reactions.id:
        // Логика для настроек реакций
        bot.sendMessage(chatId, "Здесь будут настройки реакций...");
        break;
      case TelegramKeyboard.deleteData.id:
        // Логика для удаления данных
        bot.sendMessage(chatId, "Вы уверены, что хотите удалить все ваши данные? Это действие нельзя отменить.", {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: TelegramKeyboard.deleteData.items.cancel.label,
                  callback_data: TelegramKeyboard.deleteData.items.cancel.id,
                },
                {
                  text: TelegramKeyboard.deleteData.items.delete.label,
                  callback_data: TelegramKeyboard.deleteData.items.delete.id,
                },
              ],
            ],
          },
        });
        break;
      case TelegramKeyboard.deleteData.items.delete.id:
        bot.sendMessage(chatId, "Все ваши данные были удалены.");
        break;
      case TelegramKeyboard.deleteData.items.cancel.id:
        // bot.editMessageReplyMarkup(chatId, "Удаление данных отменено.");
        bot.sendMessage(chatId, "Удаление данных отменено.");
        break;
    }

    // Подтверждаем получение callback
    bot.answerCallbackQuery(query.id);
  });
}
