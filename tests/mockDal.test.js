import test from 'node:test'
import assert from 'node:assert/strict'

import { createBatch, getMockStrains, getProgress, moveBlocksToFruiting } from '../dal/mockDal.js'

test('mock DAL returns strains with tracked batches', () => {
  const strains = getMockStrains()

  assert.ok(strains.length >= 3)
  assert.ok(strains.every((strain) => Array.isArray(strain.batches)))
   assert.ok(strains.every((strain) => strain.batches.every((batch) => batch.blockCount > 0)))
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

  const namedBatch = createBatch(strain, new Date('2026-08-19'), 7, 'Tray 7')
  const fallbackBatch = createBatch(strain, new Date('2026-08-19'), 4)
  const nextFallbackBatch = createBatch(
    { ...strain, batches: [...strain.batches, fallbackBatch] },
    new Date('2026-08-19'),
    2
  )

  assert.equal(namedBatch.label, 'Tray 7')
  assert.equal(namedBatch.blockCount, 7)
  assert.equal(fallbackBatch.label, "Lion's Mane Batch 3")
  assert.equal(fallbackBatch.blockCount, 4)
  assert.equal(nextFallbackBatch.label, "Lion's Mane Batch 4")
  assert.equal(nextFallbackBatch.blockCount, 2)
})

test('moving blocks to fruiting decreases block count or closes the batch', () => {
  const batch = { id: 'batch-a', label: 'Test A', startDate: '2026-08-17', blockCount: 5 }

  const reducedBatch = moveBlocksToFruiting(batch, 2)
  const closedBatch = moveBlocksToFruiting(batch, 5)
  const invalidMove = moveBlocksToFruiting(batch, 7)
  const zeroMove = moveBlocksToFruiting(batch, 0)
  const negativeMove = moveBlocksToFruiting(batch, -1)

  assert.deepEqual(reducedBatch, { ...batch, blockCount: 3 })
  assert.equal(closedBatch, null)
  assert.strictEqual(invalidMove, undefined)
  assert.strictEqual(zeroMove, undefined)
  assert.strictEqual(negativeMove, undefined)
})

test('creating a batch requires a positive block count', () => {
  const [strain] = getMockStrains()

  assert.throws(() => createBatch(strain, new Date('2026-08-19'), 0))
  assert.throws(() => createBatch(strain, new Date('2026-08-19'), -2))
  assert.throws(() => createBatch(strain, new Date('2026-08-19'), ''))
})
