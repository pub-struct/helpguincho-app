import { View } from 'react-native'
import { Text } from '@/components/Text'
import { styles } from './styles'
import { IResultRides } from '@/@types/history'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'


export function Historic(props: IResultRides) {
  const { price, completed_at, pickup_location, delivery_address, km } = props

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text size={12} weight='Medium_5'>
          {formatDate(completed_at, 'dd/MM/yyyy HH:mm')}
        </Text>
        <Text size={12} weight='Medium_5'>
          {formatCurrency(price)}
        </Text>
      </View>

      <Text size={12} weight='Medium_5' style={{ marginTop: 8 }}>
        🚚: {pickup_location}
      </Text>
      <Text size={12} weight='Medium_5' style={{ marginTop: 4 }}>
        🚚: {delivery_address}
      </Text>
      <Text size={12} weight='Medium_5' style={{ marginTop: 4 }}>
        📍: {km} Km
      </Text>
      {/* <Text size={12} weight='Medium_5'>
        📍: Tipo de veículo: Moto
      </Text> */}
    </View>
  )
}
