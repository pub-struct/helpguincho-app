import { View } from 'react-native'
import { styles } from './styles'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'


interface IProps {
  onOpenDrawer: VoidFunction
}

export function Header(props: IProps) {
  const { onOpenDrawer } = props
  const { user } = useAuth()

  return (
    <View style={styles.header}>
      <Button style={{ width: '20%', borderTopLeftRadius: 0 }} onPress={onOpenDrawer}>
        <Feather
          name='menu'
          size={20}
        />
      </Button>

      <Button disabled style={{ width: '70%', borderTopRightRadius: 0 }}>
        <Text numberOfLines={1}>Bem-vindo, {user.username}</Text>
      </Button>
    </View>
  )
}
