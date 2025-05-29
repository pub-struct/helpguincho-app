import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import { View } from 'react-native'


export function DrawerLayout(props: DrawerContentComponentProps) {
  const { deleteAuth } = useAuth()

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      {...props}
    >
      <View>
        <DrawerItemList {...props} />
      </View>

      <Button title='Sair' variant='outline' onPress={deleteAuth} />
    </DrawerContentScrollView>
  )
}
