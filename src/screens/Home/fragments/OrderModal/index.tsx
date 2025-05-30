import { Image, Modal, View } from 'react-native'
import { styles } from './styles'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { IMAGES } from '@/constants/images'
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { IRideDetails } from '@/@types/rides'
import { formatCurrency } from '@/utils/formatCurrency'
import { useScreen } from './useScreen'


export interface IOrderModalProps extends IRideDetails {
  visible: boolean
  onClose: VoidFunction
  onUpdateMap(origem: ILocation, destino: ILocation): void
}

export function OrderModal(props: IOrderModalProps) {
  const {
    rest,
    visible,
    isLoading,
    onRejectRide,
    onConfirmRide,
  } = useScreen(props)

  if (isLoading) {
    return (
      <View>
        <Modal
          visible={visible}
          animationType="fade"
          statusBarTranslucent
          hardwareAccelerated
          transparent
        >
          <View style={styles.overlay}>
            <View style={[styles.content, { height: 150 }]}>
              <Text weight='Medium_5' color='RED'>Carregando...</Text>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  return (
    <View>
      <Modal
        visible={visible}
        onRequestClose={isLoading ? undefined : onRejectRide}
        animationType="fade"
        statusBarTranslucent
        hardwareAccelerated
        transparent
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            {/* <View style={styles.popup}>
              <Text weight='Medium_5' color='RED'>Urgente !</Text>
            </View> */}

            {/* <Image resizeMode='contain' source={IMAGES.WINCH_CAR} style={{ width: '100%' }} /> */}

            <View style={styles.rightContainer}>
              <View style={styles.userImgContainer}>
                <Image source={IMAGES.USER} style={styles.userImg} />
              </View>

              <View style={{ flex: 1, justifyContent: 'space-between', height: '100%' }}>
                <Text weight='Medium_5' numberOfLines={2}>
                  {rest.client.full_name}
                </Text>
                <Text size={12} weight='Medium_5'>
                  {rest.client.vehicle} - {rest.client.plate}
                </Text>

                <View style={styles.footerRightContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Feather
                      name='map-pin'
                      size={12}
                    />
                    <Text size={12} weight='Medium_5'>
                      {rest.km} Km
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
                    <FontAwesome5
                      name='money-bill-alt'
                      size={15}
                    />
                    <Text size={15} weight='Medium_5'>
                      {formatCurrency(rest.price)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* <Text style={{ marginTop: 15 }} size={12} weight='Medium_5'>
              Tipo de veiculo:
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 15 }}>
              <Ionicons
                name='car-sport-outline'
                size={15}
              />
              <Text size={12} weight='Medium_5'>
                Carro
              </Text>
            </View> */}

            <Text size={12} weight='Medium_5' style={{ marginTop: 8 }}>
              Localização do veiculo:
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15 }}>
              <Feather
                name='map'
                size={15}
              />
              <Text style={{ flex: 1 }} size={12} weight='Medium_5'>
                {rest.pickup_location === 'none' ? 'Não informado' : rest.pickup_location}
              </Text>
            </View>

            <Text size={12} weight='Medium_5'>
              Local de entrega:
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15 }}>
              <Feather
                name='map-pin'
                size={15}
              />
              <Text style={{ flex: 1 }} size={12} weight='Medium_5'>
                {rest.delivery_address === 'none' ? 'Não informado' : rest.delivery_address}
              </Text>
            </View>

            <Text size={12} weight='Medium_5'>
              Descrição:
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15 }}>
              <Ionicons
                name='chatbubbles-outline'
                size={15}
              />
              <Text style={{ flex: 1 }} size={12} weight='Medium_5'>
                {rest.description === 'none' ? 'Não informado' : rest.description}
              </Text>
            </View>

            <Button title='Eu aceito' onPress={onConfirmRide} />
            <Button variant='outline' title='Recusar' onPress={onRejectRide} />
          </View>
        </View>
      </Modal>
    </View>
  )
}
