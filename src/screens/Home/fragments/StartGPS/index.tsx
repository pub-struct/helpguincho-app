import { View } from 'react-native'
import { styles } from './styles'
import { Button } from '@/components/Button'
import { PhotoModal } from '../PhotoModal'
import { useScreen } from './useScreen'


export interface IStartGPSProps {
  onUpdateMap(origem: ILocation, destino: ILocation): void
  onFinish(): Promise<void>
}

export function StartGPS(props: IStartGPSProps) {
  const {
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
          <Button
            isLoading={isLoading}
            title={`Abrir GPS - ${isButtonVisible ? 'Entrega' : 'Buscar'}`}
            onPress={onStartGPS}
          />

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
