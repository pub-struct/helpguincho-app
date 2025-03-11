import { RideContext } from '@/context/ride'
import { useContext } from 'react'

export const useRides = () => {
  const context = useContext(RideContext)
  if (context === undefined) {
    throw new Error('useRides must be used within an RidesProvider')
  }
  return context
}
