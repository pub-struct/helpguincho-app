import { ReactNode } from 'react'
import { View } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import { styles } from './styles'
import { Button } from '@/components/Button'


interface IProps {
  children: ReactNode
  open: boolean
  onOpen: VoidFunction
  onClose: VoidFunction
}

export function DrawerLayout(props: IProps) {
  const { children, onClose, onOpen, open } = props
  return (
    <Drawer
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      drawerType='front'
      // eslint-disable-next-line react-native/no-color-literals
      drawerStyle={{ backgroundColor: 'transparent' }}
      renderDrawerContent={() => (
        <View style={styles.drawerContainer}>
          <Button title='Gerar Recibo' />

          <Button variant='outline' title='Sair' />
        </View>
      )}
    >
      {children}
    </Drawer>
  )
}
