export type TTelegramKeyboard = { id: string; label: string; items?: Record<string, TTelegramKeyboard> };

const reactions = {
  id: "reactions",
  label: "Настройки реакций",
  items: {
    normal: { id: "reactions.normal", label: "Обычный режим" },
    toxic: { id: "reactions.toxic", label: "Токсичный режим" },
    custom: { id: "reactions.custom", label: "Свой режим" },
  },
} satisfies TTelegramKeyboard;

const deleteData = {
  id: "deleteData",
  label: "Удалить все мои данные",
  items: {
    cancel: { id: "deleteData.cancel", label: "Отмена" },
    delete: { id: "deleteData.delete", label: "Удалить все данные" },
  },
} satisfies TTelegramKeyboard;

export const TelegramKeyboard = {
  reactions,
  deleteData,
} as const;
