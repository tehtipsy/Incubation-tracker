<script setup>
const props = defineProps({
  batch: {
    type: Object,
    required: true
  },
  progress: {
    type: Object,
    required: true
  }
})

const progressWidth = computed(() => `${props.progress.percent}%`)
</script>

<template>
  <article class="batch-card">
    <div class="batch-card__header">
      <div>
        <h3>{{ batch.label }}</h3>
        <p>Started {{ batch.startDate }}</p>
      </div>
      <strong :class="`status status--${progress.stage}`">
        Day {{ progress.daysElapsed }}
      </strong>
    </div>

    <div
      class="progress-track"
      role="progressbar"
      :aria-label="`${batch.label} progress`"
      :aria-valuenow="progress.percent"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="progress-track__fill"
        :class="`progress-track__fill--${progress.stage}`"
        :style="{ width: progressWidth }"
      />
    </div>

    <div class="batch-card__meta">
      <span v-if="progress.stage === 'harvest'">Ready to harvest</span>
      <span v-else-if="progress.stage === 'incubating'">Early incubation</span>
      <span v-else>Colonizing</span>
      <span v-if="progress.stage !== 'harvest'">{{ progress.daysRemaining }} days to harvest target</span>
    </div>
  </article>
</template>

<style scoped>
.batch-card {
  border: 1px solid #d6d3d1;
  border-radius: 16px;
  padding: 1rem;
  background: #fffaf3;
  display: grid;
  gap: 0.75rem;
}

.batch-card__header,
.batch-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

h3,
p {
  margin: 0;
}

p,
.batch-card__meta {
  color: #57534e;
  font-size: 0.95rem;
}

.progress-track {
  width: 100%;
  height: 0.9rem;
  border-radius: 999px;
  background: #e7e5e4;
  overflow: hidden;
}

.progress-track__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.2s ease;
}

.progress-track__fill--incubating,
.status--incubating {
  background: #dc2626;
  color: #ffffff;
}

.progress-track__fill--colonizing,
.status--colonizing {
  background: #d97706;
  color: #ffffff;
}

.progress-track__fill--harvest,
.status--harvest {
  background: #16a34a;
  color: #ffffff;
}

.status {
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .batch-card__header,
  .batch-card__meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
