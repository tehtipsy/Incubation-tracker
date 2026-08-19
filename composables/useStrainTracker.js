import { createBatch, getMockStrains, getProgress } from '~/dal/mockDal'

export const useStrainTracker = () => {
  const strains = useState('strain-tracker', () => getMockStrains())

  const getStrainById = (id) => strains.value.find((strain) => strain.id === id)

  const addBatchToStrain = (strainId, label) => {
    const strain = getStrainById(strainId)

    if (!strain) {
      return null
    }

    const batch = createBatch(strain, new Date(), label)
    strain.batches = [batch, ...strain.batches]

    return batch
  }

  return {
    strains,
    getStrainById,
    addBatchToStrain,
    getProgress
  }
}
