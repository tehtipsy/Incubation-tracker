import test from 'node:test'
import assert from 'node:assert/strict'

import { createBatch, getMockStrains, getProgress } from '../dal/mockDal.js'

test('mock DAL returns strains with tracked batches', () => {
  const strains = getMockStrains()

  assert.ok(strains.length >= 3)
  assert.ok(strains.every((strain) => Array.isArray(strain.batches)))
})

test('progress stays red during early incubation and turns green at harvest', () => {
  const [strain] = getMockStrains()
  const incubatingBatch = { id: 'batch-a', label: 'Test A', startDate: '2026-08-17' }
  const harvestBatch = { id: 'batch-b', label: 'Test B', startDate: '2026-07-20' }

  const earlyProgress = getProgress(incubatingBatch, strain, new Date('2026-08-19'))
  const harvestProgress = getProgress(harvestBatch, strain, new Date('2026-08-19'))

  assert.equal(earlyProgress.stage, 'incubating')
  assert.equal(harvestProgress.stage, 'harvest')
  assert.equal(harvestProgress.percent, 100)
})

test('creating a batch uses the provided label or a generated fallback', () => {
  const [strain] = getMockStrains()

  const namedBatch = createBatch(strain, new Date('2026-08-19'), 'Tray 7')
  const fallbackBatch = createBatch(strain, new Date('2026-08-19'), '')
  const nextFallbackBatch = createBatch(
    { ...strain, batches: [...strain.batches, fallbackBatch] },
    new Date('2026-08-19'),
    ''
  )

  assert.equal(namedBatch.label, 'Tray 7')
  assert.equal(fallbackBatch.label, "Lion's Mane Batch 3")
  assert.equal(nextFallbackBatch.label, "Lion's Mane Batch 4")
})
