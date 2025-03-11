import { createContext } from 'react'

type RideContextType = {
  ride: Ride | null
  setRide: React.Dispatch<React.SetStateAction<Ride | null>>
}

export const RideContext = createContext<RideContextType | undefined>(undefined)
