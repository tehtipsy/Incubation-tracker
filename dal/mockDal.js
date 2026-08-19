const mockStrains = [
  {
    id: 'lions-mane',
    name: "Lion's Mane",
    description: 'Dense white clusters that reward patient incubation before fruiting.',
    incubationDays: 5,
    harvestDays: 18,
    batches: [
      { id: 'lm-1', label: "Lion's Mane Batch 1", startDate: '2026-08-16' },
      { id: 'lm-2', label: "Lion's Mane Batch 2", startDate: '2026-08-02' }
    ]
  },
  {
    id: 'blue-oyster',
    name: 'Blue Oyster',
    description: 'Fast-growing shelves with a shorter incubation window.',
    incubationDays: 4,
    harvestDays: 14,
    batches: [{ id: 'bo-1', label: 'Blue Oyster Batch 1', startDate: '2026-08-10' }]
  },
  {
    id: 'shiitake',
    name: 'Shiitake',
    description: 'Wood-loving strain with a longer timeline before harvest color-up.',
    incubationDays: 6,
    harvestDays: 24,
    batches: [{ id: 'sh-1', label: 'Shiitake Batch 1', startDate: '2026-07-28' }]
  }
]

const clone = (value) => JSON.parse(JSON.stringify(value))

export const getMockStrains = () => clone(mockStrains)

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const toDateString = (value) => {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const diffInDays = (startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()))
  const difference = end.getTime() - start.getTime()

  return Math.max(0, Math.floor(difference / 86400000))
}

const getNextBatchNumber = (strain) => {
  const labelPattern = new RegExp(`^${escapeRegExp(strain.name)} Batch (\\d+)$`)

  return (
    strain.batches.reduce((highestBatchNumber, batch) => {
      const match = batch.label.match(labelPattern)

      if (!match) {
        return highestBatchNumber
      }

      return Math.max(highestBatchNumber, Number(match[1]))
    }, 0) + 1
  )
}

const createBatchId = (strainId) =>
  globalThis.crypto?.randomUUID?.() ?? `${strainId}-${Date.now()}`

export const createBatch = (strain, now = new Date(), label = '') => ({
  id: createBatchId(strain.id),
  label: label.trim() || `${strain.name} Batch ${getNextBatchNumber(strain)}`,
  startDate: toDateString(now)
})

export const getProgress = (batch, strain, now = new Date()) => {
  const daysElapsed = diffInDays(batch.startDate, now)
  const percent = Math.min(100, Math.round((daysElapsed / strain.harvestDays) * 100))
  const stage =
    daysElapsed >= strain.harvestDays
      ? 'harvest'
      : daysElapsed < strain.incubationDays
        ? 'incubating'
        : 'colonizing'

  return {
    daysElapsed,
    daysRemaining: Math.max(strain.harvestDays - daysElapsed, 0),
    percent,
    stage
  }
}
