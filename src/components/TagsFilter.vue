<template>
  <div class="tags">
    <button
      v-for="tag in tags"
      :key="tag"
      :class="{ active: tag === selected }"
      @click="$emit('select', tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  tags: Array,
  selected: String
});
</script>

<style scoped>
.tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

button {
  border: none;
  background: #eef1ff;
  color: #4a55ff;
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
}

button.active {
  background: #4a55ff;
  color: white;
}
</style>