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
const finalStatusBox = height / 1.51
const BUTTON_WIDTH = 50
const PADDING_CONTAINER = 26
const BORDER_WIDTH = 2
const CONTAINER_WIDTH = width * 0.97 - PADDING_CONTAINER - BUTTON_WIDTH - BORDER_WIDTH

export function useScreen() {
  const { initSocket, disconnectSocket, isConnected } = useSocket()

  const [isAvailable, setIsAvailable] = useState<boolean>(() => isConnected)
  const [visible, setVisible] = useState<boolean>(false)

  const statusBoxPosition = useSharedValue(initialStatusBox)
  const positionX = useSharedValue(0)

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
    positionX.value = 0
    disconnectSocket()
  }

  // const renderSheetContent = () => {
  //   if (sheetContent === 'initial') {
  //     return (
  //       <View style={styles.initialContainer}>
  //         <TouchableOpacity style={styles.initialButton} onPress={() => onChangeSheetContent('historico')}>
  //           <Image
  //             source={require('@/assets/images/historico.png')}
  //             style={{ height: 50, width: 50 }}
  //           />
  //           <Text size={15} weight='Bold_7'>
  //             Histórico
  //           </Text>
  //         </TouchableOpacity>

  //         <TouchableOpacity style={styles.initialButton} onPress={() => onChangeSheetContent('conta')}>
  //           <Image
  //             source={require('@/assets/images/account.png')}
  //             style={{ height: 50, width: 50 }}
  //           />
  //           <Text size={15} weight='Bold_7'>
  //             Conta
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     )
  //   }
  //   if (sheetContent === 'historico') {
  //     return (
  //       <View style={{ flex: 1 }}>
  //         <View style={{ paddingHorizontal: 20 }}>
  //           <TouchableOpacity style={styles.sheetHeader} onPress={onBackSheet}>
  //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //               <Image
  //                 source={require('@/assets/images/historico.png')}
  //                 style={{ height: 50, width: 50 }}
  //               />
  //               <Text style={{ marginLeft: 8 }}>Histórico</Text>
  //             </View>
  //             <Text>Voltar</Text>
  //           </TouchableOpacity>
  //         </View>

  //         <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
  //           <Historic />
  //         </ScrollView>
  //       </View>
  //     )
  //   }
  //   if (sheetContent === 'conta') {
  //     return (
  //       <ScrollView style={{ flex: 1 }}>
  //         <View style={{ paddingHorizontal: 20 }}>
  //           <TouchableOpacity style={styles.sheetHeader} onPress={onBackSheet}>
  //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //               <Image
  //                 source={require('@/assets/images/account.png')}
  //                 style={{ height: 50, width: 50 }}
  //               />
  //               <Text style={{ marginLeft: 8 }}>Conta</Text>
  //             </View>
  //             <Text>Voltar</Text>
  //           </TouchableOpacity>
  //         </View>

  //         <UserInfos />
  //       </ScrollView>
  //     )
  //   }
  // }

  // useEffect(() => {
  //   if (sheetContent === 'historico' || sheetContent === 'conta') {
  //     bottomSheetRef.current?.expand()
  //   }
  //   if (sheetContent === 'initial') {
  //     bottomSheetRef.current?.collapse()
  //   }
  // }, [sheetContent])
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
    animatedStyle,
    animatedTransform,
  }
}
