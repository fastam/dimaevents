// Генерация мок-данных
const tags = ['IT', 'Бизнес', 'Спорт', 'Дизайн'];
const mockEvents = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Мероприятие ${i + 1}`,
  date: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`,
  tag: tags[i % tags.length],
  preview: `Краткое описание для мероприятия ${i + 1}...`,
  detailText: `Это полный и подробный текст для мероприятия ${i + 1}. Он загружается отдельным Ajax-запросом, как того требует ТЗ Битрикса.`
}));

// Эмуляция BX.ajax / REST
export const bxApi = {
  // Получить список (с фильтром и пагинацией)
  async getEvents(page = 1, tag = null, limit = 10) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = mockEvents;
        if (tag) {
          filtered = filtered.filter(e => e.tag === tag);
        }
        const start = (page - 1) * limit;
        const items = filtered.slice(start, start + limit);
        
        resolve({
          items,
          total: filtered.length,
          hasMore: start + limit < filtered.length
        });
      }, 400); // Имитация задержки сети
    });
  },

  // Получить список доступных тегов
  async getTags() {
    return new Promise(resolve => setTimeout(() => resolve(tags), 200));
  },

  // Получить детальную информацию
  async getEventDetail(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find(e => e.id === id);
        event ? resolve(event) : reject('Не найдено');
      }, 400);
    });
  }
};