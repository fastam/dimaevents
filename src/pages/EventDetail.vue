<template>
  <div class="event-detail">
    <div v-if="isLoading" class="loading">Загрузка информации...</div>
    <div v-else-if="event" class="detail-container">
      <div class="hero-section">
        <button class="back-btn" @click="$emit('back')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>Назад к мероприятиям</span>
        </button>

        <img :src="event.image" alt="Cover" class="hero-image" />
        <div class="hero-overlay"></div>
        
        <div class="floating-panel hero-panel">
          <h1>{{ event.title }}</h1>
          
          <div class="panel-row">
            <div class="info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>{{ event.date }}</span>
            </div>
            <div class="info-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Мест: {{ event.seats }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="main-info floating-card">
          <h2>О мероприятии</h2>
          <div class="html-content" v-html="event.description"></div>
        </div>

        <aside class="sidebar-info">
          <div class="info-card floating-card">
            <div class="detail-item">
              <span class="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </span>
              <div class="text">
                <strong>Дата проведения</strong>
                <span>{{ event.date }}</span>
              </div>
            </div>
            
            <div class="detail-item">
              <span class="icon">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </span>
              <div class="text">
                <strong>Место</strong>
                <span>Офлайн / Россия</span>
              </div>
            </div>

            <button class="register-btn">Зарегистрироваться</button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  eventId: Number
});
defineEmits(['back']);

const event = ref(null);
const isLoading = ref(true);

onMounted(() => {
  if (typeof BX !== 'undefined') {
    BX.ajax.runAction('dima:events.event.detail', {
      data: { id: props.eventId }
    }).then(response => {
      const data = response.data;
      event.value = {
        id: data.id,
        title: data.name,
        date: data.date || 'Дата не указана',
        seats: Math.floor(Math.random() * 50) + 10,
        description: data.text || data.preview || 'Описание отсутствует',
        image: 'https://placehold.co/1200x500/2c3e50/ffffff?text=Детальная+страница'
      };
      isLoading.value = false;
    }).catch(() => {
      isLoading.value = false;
    });
  }
});
</script>

<style scoped>
.loading { text-align: center; padding: 40px; font-size: 18px; color: #64748b; }
.detail-container { display: flex; flex-direction: column; gap: 24px; }

.hero-section { 
  position: relative; height: 460px; width: 100%; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;
}
.hero-image { width: 100%; height: 100%; object-fit: cover; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0) 70%); z-index: 2; }

.back-btn { 
  position: absolute; top: 24px; left: 24px; z-index: 10;
  background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 14px; padding: 12px 20px;
  display: inline-flex; align-items: center; gap: 8px;
  color: #1e293b; font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
}
.back-btn svg { width: 18px; height: 18px; color: #d35400; }
.back-btn:hover { background: rgba(255, 255, 255, 1); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); border-color: #d35400; }

.hero-panel {
  position: absolute; bottom: 24px; left: 24px; right: 24px; z-index: 10;
  background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px);
  padding: 24px 30px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.hero-panel h1 { color: #1e293b; font-size: 32px; margin: 0 0 20px 0; line-height: 1.2; font-weight: 800; }

.panel-row { 
  display: flex; align-items: center; justify-content: flex-start; gap: 32px; 
  padding-top: 16px; border-top: 1px solid #e2e8f0; 
}
.info-item { display: flex; align-items: center; gap: 10px; color: #1e293b; font-size: 16px; font-weight: 600; }
.info-item svg { width: 20px; height: 20px; color: #d35400; }

.content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

.floating-card {
  background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px);
  border-radius: 20px; padding: 32px; border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.main-info h2 { font-size: 24px; color: #1e293b; margin-top: 0; margin-bottom: 20px; }
.html-content { color: #475569; line-height: 1.7; font-size: 16px; }

.detail-item { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
.detail-item .icon { font-size: 24px; color: #d35400; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; }
.detail-item .icon svg { width: 28px; height: 28px; }
.detail-item .text strong { display: block; color: #1e293b; font-size: 15px; margin-bottom: 4px; }
.detail-item .text span { color: #475569; font-size: 15px; }

.register-btn {
  width: 100%; background: #d35400; color: #fff; border: none; padding: 16px;
  border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.2s; 
}
.register-btn:hover { background: #b84a00; transform: translateY(-2px); }

@media (max-width: 768px) {
  .content-grid { grid-template-columns: 1fr; }
  .hero-section { height: 380px; }
  .hero-panel { padding: 20px; left: 16px; right: 16px; bottom: 16px; }
  .hero-panel h1 { font-size: 24px; margin-bottom: 16px; }
  .panel-row { gap: 16px; }
  .info-item { font-size: 14px; }
  .floating-card { padding: 24px; }
  .back-btn { top: 16px; left: 16px; font-size: 14px; padding: 10px 16px; }
}
</style>