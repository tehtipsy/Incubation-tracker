<script setup>
const { strains } = useStrainTracker()
</script>

<template>
  <main class="page-shell">
    <section class="hero">
      <p class="eyebrow">Incubation dashboard</p>
      <h1>Mushroom strain tracker</h1>
      <p>
        Choose a fungi strain to view its batches, add a new one, and monitor incubation progress on a per-batch tracker.
      </p>
    </section>

    <section class="strain-grid" aria-label="Fungi strains">
      <NuxtLink
        v-for="strain in strains"
        :key="strain.id"
        :to="`/strains/${strain.id}`"
        class="strain-card"
      >
        <span>{{ strain.name }}</span>
        <small>{{ strain.batches.length }} tracked batches</small>
      </NuxtLink>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background:
    radial-gradient(circle at top, rgba(163, 230, 53, 0.2), transparent 30%),
    linear-gradient(180deg, #fafaf9, #f5f5f4);
  color: #1c1917;
}

.hero,
.strain-grid {
  max-width: 960px;
  margin: 0 auto;
}

.hero {
  margin-bottom: 2rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #65a30d;
  font-weight: 700;
}

h1 {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 4vw, 3.5rem);
}

.hero p {
  max-width: 42rem;
  line-height: 1.6;
}

.strain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.strain-card {
  display: grid;
  gap: 0.35rem;
  padding: 1.25rem;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #d6d3d1;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 18px 50px -32px rgba(28, 25, 23, 0.35);
}

.strain-card span {
  font-size: 1.15rem;
  font-weight: 700;
}

.strain-card small {
  color: #57534e;
}
</style>
