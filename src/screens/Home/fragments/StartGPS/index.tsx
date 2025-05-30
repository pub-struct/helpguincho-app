import { TouchableOpacity, View } from 'react-native'
import { styles } from './styles'
import { Button } from '@/components/Button'
import { PhotoModal } from '../PhotoModal'
import { useScreen } from './useScreen'
import { Feather } from '@expo/vector-icons'
import { Text } from '@/components/Text'
import { formatDuration } from '@/utils/formatDuration'


export interface IStartGPSProps {
  onUpdateMap(origem: ILocation, destino: ILocation): void
  onFinish(): Promise<void>
}

export function StartGPS(props: IStartGPSProps) {
  const {
    ride,
    COLORS,
    visible,
    isLoading,
    isButtonVisible,
    onDelivery,
    onStartGPS,
    onFinishRide,
    handleVisible,
  } = useScreen(props)

  return (
    <>
      <View style={styles.container} pointerEvents='box-none'>
        <View style={styles.content}>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            onPress={onStartGPS}
          >
            <View style={styles.yellowDot}>
              <Feather name='arrow-up' size={25} color={COLORS.TEXT_2} />
            </View>

            <View style={{ flex: 1 }}>
              <Text color='TEXT_2' style={{ width: '100%' }} size={14}>
                Pressione aqui para abrir GPS - {isButtonVisible ? 'Entregar' : 'Buscar'}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text color='TEXT_2' size={12}>
                  {formatDuration(ride.time)}
                </Text>
                <View style={[styles.yellowDot, { width: 5, height: 5 }]} />
                <Text color='TEXT_2' size={12}>
                  {ride.km}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {isButtonVisible ? (
            <Button
              isLoading={isLoading}
              title='Finalizar serviço'
              onPress={onFinishRide}
            />
          ) : (
            <Button title='Guinchar veiculo' onPress={handleVisible} />
          )}
        </View>
      </View>

      <PhotoModal visible={visible} onClose={handleVisible} onDelivery={onDelivery} />
    </>
  )
}
