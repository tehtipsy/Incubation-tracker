<script setup>
const route = useRoute()
const draftLabel = ref('')
const { getStrainById, addBatchToStrain, getProgress } = useStrainTracker()

const strain = computed(() => getStrainById(route.params.id))

const addBatch = () => {
  if (!strain.value) {
    return
  }

  addBatchToStrain(strain.value.id, draftLabel.value)
  draftLabel.value = ''
}
</script>

<template>
  <main class="page-shell">
    <section v-if="strain" class="strain-page">
      <NuxtLink to="/" class="back-link">← Back to strains</NuxtLink>

      <header class="strain-header">
        <div>
          <p class="eyebrow">Strain menu</p>
          <h1>{{ strain.name }}</h1>
          <p>{{ strain.description }}</p>
        </div>
        <div class="tracker-summary">
          <strong>{{ strain.batches.length }}</strong>
          <span>tracked batches</span>
        </div>
      </header>

      <section class="controls">
        <label class="input-group" for="batchLabel">
          <span>Batch label</span>
          <input
            id="batchLabel"
            v-model="draftLabel"
            type="text"
            placeholder="Example: Tray 4"
          >
        </label>
        <button type="button" class="add-button" @click="addBatch">
          Add batch to tracker
        </button>
      </section>

      <section class="batch-list" aria-label="Tracked batches">
        <BatchProgressBar
          v-for="batch in strain.batches"
          :key="batch.id"
          :batch="batch"
          :progress="getProgress(batch, strain)"
        />
      </section>
    </section>

    <section v-else class="empty-state">
      <NuxtLink to="/" class="back-link">← Back to strains</NuxtLink>
      <h1>Strain not found</h1>
      <p>Choose one of the available fungi strains from the main dashboard.</p>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: 2rem 1.5rem 3rem;
  background: #f5f5f4;
  color: #1c1917;
}

.strain-page,
.empty-state {
  max-width: 960px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  margin-bottom: 1.5rem;
  color: #3f6212;
  text-decoration: none;
  font-weight: 600;
}

.strain-header,
.controls {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.strain-header {
  margin-bottom: 1.5rem;
}

.tracker-summary {
  min-width: 160px;
  padding: 1rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #d6d3d1;
  text-align: center;
}

.tracker-summary strong {
  display: block;
  font-size: 2rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #65a30d;
  font-weight: 700;
}

h1 {
  margin: 0 0 0.5rem;
}

.controls {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #d6d3d1;
  border-radius: 20px;
  background: #ffffff;
}

.input-group {
  display: grid;
  gap: 0.4rem;
  flex: 1;
}

.input-group input {
  border: 1px solid #a8a29e;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font: inherit;
}

.add-button {
  border: none;
  border-radius: 999px;
  padding: 0.9rem 1.25rem;
  font: inherit;
  font-weight: 700;
  color: white;
  background: #65a30d;
  cursor: pointer;
}

.batch-list {
  display: grid;
  gap: 1rem;
}

@media (max-width: 720px) {
  .strain-header,
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
