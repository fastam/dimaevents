<template>
  <div class="app-layout">
    <header class="main-header">
      <div class="container">
        <h1>Афиша мероприятий</h1>
      </div>
    </header>

    <main class="container">
      <transition name="fade" mode="out-in">
        <EventDetail 
          v-if="selectedEventId" 
          :eventId="selectedEventId" 
          @back="selectedEventId = null" 
        />
        <EventsList 
          v-else 
          @openDetail="id => selectedEventId = id" 
        />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EventsList from './pages/EventsList.vue';
import EventDetail from './pages/EventDetail.vue';

const selectedEventId = ref(null);
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
  color: #334155;
  padding-bottom: 60px;
}

.main-header {
  padding: 40px 0 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-header h1 {
  margin: 0;
  font-size: 32px;
  color: #1e293b;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>