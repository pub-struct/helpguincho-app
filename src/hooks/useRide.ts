import { RideContext } from '@/context/RideContext'
import { useContext } from 'react'


export const useRide = () => useContext(RideContext)
