<template>
  <header class="header">
    <div class="container">
      <nav class="nav-menu" @mouseleave="hoveredId = null">
        <div class="glider" :style="gliderStyle"></div>
        
        <button
          v-for="item in menuItems"
          :key="item.id"
          :ref="el => { if (el) itemRefs[item.id] = el }"
          class="nav-item"
          :class="{ 'is-active': activeMenu === item.id }"
          @mouseenter="hoveredId = item.id"
          @click="$emit('navigate', item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const props = defineProps({
  activeMenu: String
});

defineEmits(['navigate']);

const menuItems = [
  { id: 'events', label: 'Мероприятия' },
  { id: 'about', label: 'О компании' },
  { id: 'contacts', label: 'Контакты' }
];

const itemRefs = ref({});
const hoveredId = ref(null);

const targetId = computed(() => hoveredId.value || props.activeMenu);

const gliderStyle = ref({ left: '0px', width: '0px', opacity: 0 });

const updateGlider = () => {
  const id = targetId.value;
  if (!id || !itemRefs.value[id]) {
    gliderStyle.value.opacity = 0;
    return;
  }
  const el = itemRefs.value[id];
  gliderStyle.value = {
    left: `${el.offsetLeft}px`,
    width: `${el.offsetWidth}px`,
    opacity: 1
  };
};

watch(targetId, async () => {
  await nextTick();
  updateGlider();
});

onMounted(() => {
  updateGlider();
  window.addEventListener('resize', updateGlider);
});
</script>

<style scoped>
.header {
  background-color: #e2e8f0;
  padding: 15px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.nav-menu {
  position: relative;
  display: inline-flex;
  gap: 15px;
}

.nav-item {
  position: relative;
  z-index: 2;
  background-color: #ffffff;
  color: #475569;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.nav-item:hover, .nav-item.is-active {
  color: #d35400;
}

.glider {
  position: absolute;
  bottom: -6px;
  height: 4px;
  background-color: #d35400;
  border-radius: 4px;
  z-index: 1;
  pointer-events: none;
  transition: left 0.3s cubic-bezier(0.25, 1, 0.5, 1),
              width 0.3s cubic-bezier(0.25, 1, 0.5, 1),
              opacity 0.3s ease;
}
</style>