<template>
  <div class="events-list">
    <div class="tags-wrapper">
      <div class="tags-form">
        <nav class="tags-nav" @mouseleave="hoveredTag = null">
          <div class="glider" :style="gliderStyle"></div>

          <button 
            :ref="el => setTagRef(el, 'all')"
            class="tag-btn" 
            :class="{ active: !selectedTag }"
            data-text="Все"
            @mouseenter="hoveredTag = 'all'"
            @click="clearTags"
          >
            <span class="text">Все</span>
            <span class="tag-line"></span>
          </button>
          
          <button 
            v-for="tag in availableTags" 
            :key="tag" 
            :ref="el => setTagRef(el, tag)"
            class="tag-btn"
            :class="{ active: selectedTag === tag }"
            :data-text="tag"
            @mouseenter="hoveredTag = tag"
            @click="toggleTag(tag)"
          >
            <span class="text">{{ tag }}</span>
            <span class="tag-line"></span>
          </button>
        </nav>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Загрузка мероприятий...</div>

    <div v-else class="grid">
      <div 
        v-for="event in events" 
        :key="event.id" 
        class="event-card"
        @click="$emit('openDetail', event.id)"
      >
        <img :src="event.image" :alt="event.title" class="card-bg">
        <div class="card-overlay"></div>
        
        <div class="tags-badges">
          <span class="badge" v-for="t in event.tag" :key="t">{{ t }}</span>
        </div>
        
        <div class="floating-panel">
          <h3>{{ event.title }}</h3>
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
    </div>

    <div class="pagination-controls" v-if="!isLoading && events.length > 0">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Назад</button>
      <span>Страница {{ currentPage }}</span>
      <button @click="changePage(currentPage + 1)">Далее</button>
    </div>

    <button class="scroll-top-btn" :class="{ 'is-visible': showScrollTop }" @click="scrollToTop">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

defineEmits(['openDetail']);

const availableTags = ref([]);
const events = ref([]);
const selectedTag = ref(null);
const hoveredTag = ref(null);
const showScrollTop = ref(false);
const currentPage = ref(1);
const isLoading = ref(false);

const loadTags = () => {
  if (typeof BX !== 'undefined') {
    BX.ajax.runAction('dima:events.event.tags').then(response => {
      availableTags.value = response.data;
    });
  }
};

const loadEvents = (page = 1) => {
  isLoading.value = true;
  if (typeof BX !== 'undefined') {
    BX.ajax.runAction('dima:events.event.list', {
      data: { page: page, tag: selectedTag.value }
    }).then(response => {
      events.value = response.data.items.map(item => ({
        id: item.id,
        title: item.name,
        date: item.date || 'Дата не указана',
        preview: item.preview,
        tag: selectedTag.value ? [selectedTag.value] : [],
        image: 'https://placehold.co/600x400/2c3e50/ffffff?text=Event',
        seats: Math.floor(Math.random() * 50) + 10
      }));
      currentPage.value = parseInt(response.data.pagination.page);
      isLoading.value = false;
    }).catch(() => {
      isLoading.value = false;
    });
  }
};

const toggleTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
  loadEvents(1);
};

const clearTags = () => {
  selectedTag.value = null;
  loadEvents(1);
};

const changePage = (page) => {
  loadEvents(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const tagRefs = ref({});
const setTagRef = (el, tag) => { if (el) tagRefs.value[tag] = el; };

const gliderStyle = ref({ left: '0px', top: '0px', width: '0px', opacity: 0 });
const updateGlider = () => {
  const id = hoveredTag.value || selectedTag.value || 'all';
  if (!tagRefs.value[id]) {
    gliderStyle.value.opacity = 0; return;
  }
  const el = tagRefs.value[id];
  gliderStyle.value = {
    left: `${el.offsetLeft}px`, top: `${el.offsetTop + el.offsetHeight - 2}px`, 
    width: `${el.offsetWidth}px`, opacity: 1
  };
};

watch(hoveredTag, async () => { await nextTick(); updateGlider(); });
watch(selectedTag, async () => { await nextTick(); updateGlider(); });

const handleScroll = () => showScrollTop.value = window.scrollY > 300;
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(() => { 
  loadTags();
  loadEvents(1);
  updateGlider(); 
  window.addEventListener('resize', updateGlider); 
  window.addEventListener('scroll', handleScroll); 
});

onUnmounted(() => { 
  window.removeEventListener('resize', updateGlider); 
  window.removeEventListener('scroll', handleScroll); 
});
</script>

<style scoped>
.tags-wrapper { position: sticky; top: 20px; z-index: 100; margin-bottom: 24px; }
.tags-form {
  background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-radius: 16px;
  padding: 20px 30px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: inline-block; width: 100%; box-sizing: border-box;
}
.tags-nav { position: relative; display: flex; gap: 32px; flex-wrap: wrap; }
.glider {
  position: absolute; height: 2px; background-color: #d35400; border-radius: 2px; z-index: 1; pointer-events: none;
  transition: left 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease;
}

.tag-btn {
  display: inline-grid; position: relative; z-index: 2; padding: 0 0 8px 0;
  background: transparent; border: none; cursor: pointer; color: #64748b; transition: color 0.2s ease;
}
.tag-btn::before { content: attr(data-text); grid-area: 1 / 1; font-weight: 600; visibility: hidden; }
.tag-btn .text { grid-area: 1 / 1; font-weight: 500; font-size: 16px; }
.tag-btn:hover { color: #d35400; }
.tag-btn.active .text { font-weight: 600; color: #d35400; }
.tag-line {
  position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background-color: #d35400; border-radius: 2px;
  transform: scaleX(0); transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
.tag-btn.active .tag-line { transform: scaleX(1); }

.loading { text-align: center; padding: 40px; font-size: 18px; color: #64748b; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
.event-card { 
  position: relative; height: 380px; border-radius: 20px; overflow: hidden; 
  cursor: pointer; display: flex; flex-direction: column;
}
.card-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; z-index: 1; }
.event-card:hover .card-bg { transform: scale(1.05); }
.card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0) 60%); z-index: 2; }

.event-card::after {
  content: ''; position: absolute; inset: 0; border: 2px solid #d35400; border-radius: 20px;
  opacity: 0; transition: opacity 0.3s ease, box-shadow 0.3s ease; pointer-events: none; z-index: 10;
}
.event-card:hover::after { opacity: 1; box-shadow: inset 0 0 20px rgba(211, 84, 0, 0.2); }

.tags-badges { position: absolute; top: 16px; left: 16px; display: flex; gap: 6px; flex-wrap: wrap; z-index: 3; }
.badge { background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); color: #d35400; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; }

.floating-panel {
  position: absolute; bottom: 16px; left: 16px; right: 16px; z-index: 3;
  background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
  padding: 20px; border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.floating-panel h3 { margin: 0 0 16px 0; font-size: 19px; color: #1e293b; line-height: 1.3; font-weight: 700; }

.panel-row { 
  display: flex; align-items: center; justify-content: space-between; gap: 16px; 
  padding-top: 14px; border-top: 1px solid #e2e8f0; 
}
.info-item { display: flex; align-items: center; gap: 8px; color: #1e293b; font-size: 15px; font-weight: 600; }
.info-item svg { width: 18px; height: 18px; color: #d35400; }

.pagination-controls { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 40px; }
.pagination-controls button { background: #d35400; color: #fff; border-radius: 8px; font-weight: 600; }
.pagination-controls button:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }

.scroll-top-btn {
  position: fixed; bottom: 40px; right: 40px; width: 50px; height: 50px; background-color: #d35400; color: white; border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(211, 84, 0, 0.3); opacity: 0; visibility: hidden;
  transform: translateY(20px); transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); z-index: 1000;
}
.scroll-top-btn svg { width: 24px; height: 24px; }
.scroll-top-btn.is-visible { opacity: 1; visibility: visible; transform: translateY(0); }
.scroll-top-btn:hover { background-color: #b84a00; transform: translateY(-4px); }
</style>