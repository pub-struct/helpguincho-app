import { TouchableOpacity, View } from 'react-native'
import { styles } from  './styles'
import { Text } from '@/components/Text'
import Animated from 'react-native-reanimated'
import { ConfirmModal } from '../ConfirmModal'
import { Feather } from '@expo/vector-icons'
import { useScreen } from './useScreen'


export function FloatCardStart() {
  const {
    handleModal,
    onStart,
    onEnd,
    COLORS,
    visible,
    isAvailable,
    animatedStyle,
    animatedTransform,
  } = useScreen()

  return (
    <>
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View style={[styles.statusBox, animatedStyle]}>
          <View style={styles.blurContainer}>
            <Text size={18} weight='Bold_7' color='TEXT_2' style={{ marginBottom: 8 }}>
              Você está <Text color={isAvailable ? 'GREEN_100' : 'RED_100'}>
                {isAvailable ? 'ON' : 'OFF'}
              </Text>
            </Text>

            <Text size={14} color='TEXT_2' style={{ marginBottom: 8 }}>
              Guinchos feitos hoje: X
            </Text>

            <Text size={13} color='PLACEHOLDER' style={{ marginBottom: 16 }}>
              {isAvailable
                ? 'Você está disponível para receber chamados!'
                : 'Buscaremos serviço de guinchos assim que ficar online.'}
            </Text>

            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: isAvailable ? COLORS.PRIMARY : COLORS.BACKGROUND_OPACITY_1 }
              ]}
              onPress={isAvailable ? handleModal : onStart}
            >
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  size={14}
                  weight='Bold_7'
                  color={isAvailable ? 'TEXT' : 'TEXT_2'}
                >
                  {isAvailable ? 'Hora de descansar?' : 'Estou pronto pra trabalhar'}
                </Text>
              </View>

              <Animated.View style={[styles.animatedBtn, animatedTransform]}>
                <Feather
                  name={isAvailable ? 'chevrons-left' : 'chevrons-right'}
                  size={40}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <ConfirmModal visible={visible} onClose={handleModal} onConfirm={onEnd} />
    </>
  )
}
