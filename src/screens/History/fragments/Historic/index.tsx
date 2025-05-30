import { View } from 'react-native'
import { Text } from '@/components/Text'
import { styles } from './styles'
import { IResultRides } from '@/@types/history'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { Feather } from '@expo/vector-icons'


export function Historic(props: IResultRides) {
  const { price, completed_at, created_at, pickup_location, delivery_address, km } = props

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text size={12} weight='Medium_5'>
          Criado em: {formatDate(created_at, 'dd/MM/yyyy HH:mm')}
        </Text>
        <Text size={12} weight='Medium_5'>
          {formatCurrency(price)}
        </Text>
      </View>

      {completed_at && (
        <Text size={12} weight='Medium_5'>
          Concluída em: {formatDate(completed_at, 'dd/MM/yyyy HH:mm')}
        </Text>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }}>
        <Feather
          name='map'
          size={15}
        />
        <Text size={12} weight='Medium_5'>
          {pickup_location === 'none' ? 'Não informado' : pickup_location}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }}>
        <Feather
          name='map-pin'
          size={15}
        />
        <Text size={12} weight='Medium_5'>
          {delivery_address === 'none' ? 'Não informado' : delivery_address}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }}>
        <Feather
          name='check'
          size={15}
        />
        <Text size={12} weight='Medium_5'>
          {km} Km
        </Text>
      </View>

      {/* <Text size={12} weight='Medium_5'>
        📍: Tipo de veículo: Moto
      </Text> */}
    </View>
  )
}
