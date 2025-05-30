import { View } from 'react-native'
import Reanimated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { THEME } from '@/theme'
import { IMAGES } from '@/constants/images'


export function Loading() {
  const { COLORS } = THEME
  const { SVGS } = IMAGES

  const pulse = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: pulse.value, // Aplica o valor interpolado ao scale
        },
      ],
      opacity: interpolate(
        pulse.value,
        [1, 1.1], // Intervalo do valor de `pulse`
        [0.7, 1]  // Opacidade correspondente
      ),
    }
  })

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1, // Repete indefinidamente
      true // Inverte a animação para criar o efeito de pulsação
    )
  }, [])

  return (
    <Reanimated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.PRIMARY
      }}
    >
      <Reanimated.View style={animatedStyle}>
        <View style={{ width: '50%' }}>
          <SVGS.Logo width={300} height={300} />
        </View>
      </Reanimated.View>
    </Reanimated.View>
  )
}
