import { View } from 'react-native'
import { Text } from '@/components/Text'
import { styles } from './styles'


export function Historic() {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text size={12} weight='Medium_5'>
          29/01/2025 16:53
        </Text>
        <Text size={12} weight='Medium_5'>
          R$ 150,00
        </Text>
      </View>

      <Text size={12} weight='Medium_5' style={{ marginTop: 8 }}>
        🚚: 55, rua X, São Paulo-SP
      </Text>
      <Text size={12} weight='Medium_5'>
        📍: Tipo de veículo: Moto
      </Text>
    </View>
  )
}
