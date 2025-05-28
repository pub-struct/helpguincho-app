import { View } from 'react-native'
import { styles } from './styles'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { Feather } from '@expo/vector-icons'


interface IProps {
  onOpenDrawer: VoidFunction
}

export function Header(props: IProps) {
  const { onOpenDrawer } = props

  return (
    <View style={styles.header}>
      <Button style={{ width: '20%', borderTopLeftRadius: 0 }} onPress={onOpenDrawer}>
        <Feather
          name='menu'
          size={20}
        />
      </Button>

      <Button disabled style={{ width: '70%', borderTopRightRadius: 0 }}>
        <Text>Bem-vindo, Usuário</Text>
      </Button>
    </View>
  )
}
