import { Vibration } from 'react-native'


export function Vibrate(repeat: boolean = false): void {
  return Vibration.vibrate([0, 200, 100, 100, 100, 100, 100, 100, 100, 100], repeat)
}
