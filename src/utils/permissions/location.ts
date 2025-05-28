import * as Location from 'expo-location'


export async function getLocationPermission(): Promise<Location.LocationObject | null> {
  const { granted } = await Location.requestForegroundPermissionsAsync()

  if (granted) {
    const initialLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation
    })

    return initialLocation
  }

  return null
}
