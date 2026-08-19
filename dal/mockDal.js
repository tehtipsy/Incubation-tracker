const mockStrains = [
  {
    id: 'lions-mane',
    name: "Lion's Mane",
    description: 'Dense white clusters that reward patient incubation before fruiting.',
    incubationDays: 5,
    harvestDays: 18,
    batches: [
      { id: 'lm-1', label: "Lion's Mane Batch 1", startDate: '2026-08-16', blockCount: 6 },
      { id: 'lm-2', label: "Lion's Mane Batch 2", startDate: '2026-08-02', blockCount: 4 }
    ]
  },
  {
    id: 'blue-oyster',
    name: 'Blue Oyster',
    description: 'Fast-growing shelves with a shorter incubation window.',
    incubationDays: 4,
    harvestDays: 14,
    batches: [{ id: 'bo-1', label: 'Blue Oyster Batch 1', startDate: '2026-08-10', blockCount: 5 }]
  },
  {
    id: 'shiitake',
    name: 'Shiitake',
    description: 'Wood-loving strain with a longer timeline before harvest color-up.',
    incubationDays: 6,
    harvestDays: 24,
    batches: [{ id: 'sh-1', label: 'Shiitake Batch 1', startDate: '2026-07-28', blockCount: 3 }]
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
  const [year, month, day] = startDate.split('-').map(Number)

  if (![year, month, day].every(Number.isFinite)) {
    return 0
  }

  const start = new Date(Date.UTC(year, month - 1, day))
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

const toPositiveInteger = (value) => {
  const count = Number.parseInt(`${value}`, 10)

  if (!Number.isInteger(count) || count <= 0) {
    return null
  }

  return count
}

export const createBatch = (strain, now = new Date(), blockCount, label = '') => {
  const normalizedBlockCount = toPositiveInteger(blockCount)

  if (!normalizedBlockCount) {
    throw new Error('Block count must be a positive integer')
  }

  return {
    id: createBatchId(strain.id),
    label: label.trim() || `${strain.name} Batch ${getNextBatchNumber(strain)}`,
    startDate: toDateString(now),
    blockCount: normalizedBlockCount
  }
}

export const moveBlocksToFruiting = (batch, blocksToMove) => {
  const normalizedBlocksToMove = toPositiveInteger(blocksToMove)

  if (!normalizedBlocksToMove || normalizedBlocksToMove > batch.blockCount) {
    return undefined
  }

  const remainingBlocks = batch.blockCount - normalizedBlocksToMove

  if (remainingBlocks === 0) {
    return null
  }

  return {
    ...batch,
    blockCount: remainingBlocks
  }
}

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
