import { THEME } from '@/theme'
import { useEffect, useState } from 'react'
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useSocket } from '@/hooks/useSocket'
import { storageGetToken } from '@/services/storage/Auth'
import { Dimensions } from 'react-native'


const { height, width } = Dimensions.get('window')
const initialStatusBox = height / 3
const finalStatusBox = height / 1.4
const BUTTON_WIDTH = 50
const PADDING_CONTAINER = 26
const BORDER_WIDTH = 1
const CONTAINER_WIDTH = width * 0.97 - PADDING_CONTAINER - BUTTON_WIDTH - BORDER_WIDTH
const initialPositionX = 0

export function useScreen() {
  const { initSocket, disconnectSocket, isConnected } = useSocket()

  const [isAvailable, setIsAvailable] = useState<boolean>(() => isConnected)
  const [visible, setVisible] = useState<boolean>(false)

  const statusBoxPosition = useSharedValue(initialStatusBox)
  const positionX = useSharedValue(initialPositionX)

  const config = {
    duration: 300,
    easing: Easing.inOut(Easing.cubic)
  }

  const { COLORS } = THEME
  const animatedStyle = useAnimatedStyle(() => ({
    top: statusBoxPosition.value,
  }))
  const animatedTransform  = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(positionX.value, config) }],
  }))

  const handleAvailable = () => setIsAvailable(!isAvailable)
  const handleModal = () => setVisible(!visible)

  async function onStart() {
    handleAvailable()
    positionX.value = CONTAINER_WIDTH
    const token = await storageGetToken()
    initSocket(token)
  }

  function onEnd() {
    handleAvailable()
    handleModal()
    positionX.value = initialPositionX
    disconnectSocket()
  }

  useEffect(() => {
    statusBoxPosition.value = withTiming(isAvailable ? finalStatusBox : initialStatusBox, config)
  }, [isAvailable])

  return {
    handleModal,
    onStart,
    onEnd,
    COLORS,
    visible,
    isAvailable,
    BUTTON_WIDTH,
    animatedStyle,
    animatedTransform,
  }
}
