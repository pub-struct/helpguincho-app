import { Modal, TouchableOpacity, View, Image } from 'react-native'
import { styles } from './styles'
import { Text } from '@/components/Text'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '@/components/Button'
import { useScreen } from './useScreen'


export interface IPhotoModalProps {
  visible: boolean
  onClose(): void
  onDelivery(): Promise<void>
}

export function PhotoModal(props: IPhotoModalProps) {
  const {
    isUploading,
    isDisabled,
    visible,
    photos,
    onClose,
    handleTakePhoto,
    handleConfirmPhotos,
  } = useScreen(props)

  return (
    <View>
      <Modal
        visible={visible}
        onRequestClose={isUploading ? undefined : onClose}
        statusBarTranslucent
        transparent
        hardwareAccelerated
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.borderTop}>
            <View style={styles.content}>
              <Text weight='Medium_5'>
                Para sua e nossa segurança, tire 4 fotos do estado atual do veículo que está sendo guinchado.
              </Text>

              <View style={styles.photoRow}>
                {photos.map((photo, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.photoPlaceholder}
                    onPress={() => handleTakePhoto(index)}
                    disabled={isUploading}
                  >
                    {photo ? (
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    ) : (
                      <View>
                        <Ionicons name="camera" size={32} color="gray" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* {isUploading && (
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
              )} */}

              <Button
                isLoading={isUploading}
                disabled={isDisabled}
                title='Ir para entrega'
                onPress={handleConfirmPhotos}
              />
              <Button
                isLoading={isUploading}
                variant='outline'
                title='Voltar'
                onPress={onClose}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
