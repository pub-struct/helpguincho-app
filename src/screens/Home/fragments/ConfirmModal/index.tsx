import { Modal, View } from 'react-native'
import { styles } from './styles'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'


interface IProps {
  visible: boolean
  onClose: VoidFunction
  onConfirm: VoidFunction
}

export function ConfirmModal(props: IProps) {
  const { onClose, onConfirm, visible } = props

  return (
    <View>
      <Modal
        visible={visible}
        onRequestClose={onClose}
        animationType="fade"
        statusBarTranslucent
        hardwareAccelerated
        transparent
      >
        <View style={styles.overlay}>
          <View style={styles.borderTop}>
            <View style={styles.content}>
              <Text weight='Medium_5'>
                Tem certeza que deseja cancelar a busca por serviços de guincho?
              </Text>

              <View style={{ marginTop: 10 }}>
                <Button title='Voltar ao trabalho' onPress={onClose} />
                <Button variant='outline' title='Sim, cancelar' onPress={onConfirm} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
