import { createBatch, getMockStrains, getProgress, moveBlocksToFruiting } from '~/dal/mockDal'

export const useStrainTracker = () => {
  const strains = useState('strain-tracker', () => getMockStrains())

  const getStrainById = (id) => strains.value.find((strain) => strain.id === id)

  const addBatchesToStrain = (strainId, blockCount, quantity = 1) => {
    const strainIndex = strains.value.findIndex((strain) => strain.id === strainId)

    if (strainIndex === -1) {
      return []
    }

    const strain = strains.value[strainIndex]
    const normalizedQuantity = Number.parseInt(`${quantity}`, 10)
    const safeQuantity = Number.isInteger(normalizedQuantity) && normalizedQuantity > 0
      ? normalizedQuantity
      : 1
    const createdBatches = []
    let currentBatches = [...strain.batches]

    for (let index = 0; index < safeQuantity; index += 1) {
      const batch = createBatch({ ...strain, batches: currentBatches }, new Date(), blockCount)
      createdBatches.unshift(batch)
      currentBatches = [...currentBatches, batch]
    }

    strains.value = strains.value.map((currentStrain, index) =>
      index === strainIndex
        ? { ...currentStrain, batches: [...createdBatches, ...currentStrain.batches] }
        : currentStrain
    )

    return createdBatches
  }

  const moveBatchBlocksToFruiting = (strainId, batchId, blocksToMove) => {
    const strainIndex = strains.value.findIndex((strain) => strain.id === strainId)

    if (strainIndex === -1) {
      return null
    }

    const strain = strains.value[strainIndex]
    const batchIndex = strain.batches.findIndex((batch) => batch.id === batchId)

    if (batchIndex === -1) {
      return null
    }

    const batch = strain.batches[batchIndex]
    const updatedBatch = moveBlocksToFruiting(batch, blocksToMove)

    if (typeof updatedBatch === 'undefined') {
      return null
    }

    const updatedBatches = [...strain.batches]

    if (!updatedBatch) {
      updatedBatches.splice(batchIndex, 1)
    } else {
      updatedBatches.splice(batchIndex, 1, updatedBatch)
    }

    strains.value = strains.value.map((currentStrain, index) =>
      index === strainIndex
        ? { ...currentStrain, batches: updatedBatches }
        : currentStrain
    )

    return updatedBatch
  }

  return {
    strains,
    getStrainById,
    addBatchesToStrain,
    moveBatchBlocksToFruiting,
    getProgress
  }
}
