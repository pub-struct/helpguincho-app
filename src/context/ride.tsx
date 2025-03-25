import { createContext } from 'react'

type RideContextType = {
  ride: Ride | null;
  setRide: React.Dispatch<React.SetStateAction<Ride | null>>;
  activeRide: Ride | null;
  setActiveRide: React.Dispatch<React.SetStateAction<Ride | null>>;
  showDeliveryRoute: boolean;
  setShowDeliveryRoute: React.Dispatch<React.SetStateAction<boolean>>;
  isAvailable: boolean;
  setIsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
};

//export const RideContext = createContext<RideContextType | undefined>(undefined)
export const RideContext = createContext<RideContextType>({
  ride: null,
  setRide: () => {},
  activeRide: null,
  setActiveRide: () => {},
  showDeliveryRoute: false,
  setShowDeliveryRoute: () => {},
  isAvailable: false,
  setIsAvailable: () => {}
});
