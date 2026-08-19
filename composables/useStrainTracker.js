import { createBatch, getMockStrains, getProgress } from '~/dal/mockDal'

export const useStrainTracker = () => {
  const strains = useState('strain-tracker', () => getMockStrains())

  const getStrainById = (id) => strains.value.find((strain) => strain.id === id)

  const addBatchToStrain = (strainId, label) => {
    const strainIndex = strains.value.findIndex((strain) => strain.id === strainId)

    if (strainIndex === -1) {
      return null
    }

    const strain = strains.value[strainIndex]
    const batch = createBatch(strain, new Date(), label)
    strains.value = strains.value.map((currentStrain, index) =>
      index === strainIndex
        ? { ...currentStrain, batches: [batch, ...currentStrain.batches] }
        : currentStrain
    )

    return batch
  }

  return {
    strains,
    getStrainById,
    addBatchToStrain,
    getProgress
  }
}
