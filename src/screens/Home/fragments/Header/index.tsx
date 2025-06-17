import { View } from 'react-native'
import { styles } from './styles'
import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'


interface IProps {
  onOpenDrawer: VoidFunction
  onRequestNotifications: () => Promise<void>
  isNotificationEnabled: boolean
}

export function Header(props: IProps) {
  const { onOpenDrawer, onRequestNotifications, isNotificationEnabled } = props
  const { user } = useAuth()

  return (
    <View style={styles.header}>
      <Button style={{ width: '20%', borderTopLeftRadius: 0 }} onPress={onOpenDrawer}>
        <Feather
          name='menu'
          size={20}
        />
      </Button>

      <Button disabled style={{ width: '60%' }}>
        <Text numberOfLines={1}>Bem-vindo, {user.username}</Text>
      </Button>

      <Button
        style={{
          width: '20%',
          borderTopRightRadius: 0,
          opacity: isNotificationEnabled ? 0.5 : 1
        }}
        onPress={onRequestNotifications}
        disabled={isNotificationEnabled}
      >
        <Feather
          name={isNotificationEnabled ? 'bell' : 'bell-off'}
          size={20}
        />
      </Button>
    </View>
  )
}
