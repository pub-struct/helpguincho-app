import { IPhotoModalProps } from '.'
import { Alert } from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { sendPhotos } from '../../services/api'
import { useRide } from '@/hooks/useRide'
import { handleErrors } from '@/services/errors/ErrorHandler'


export function useScreen(props: IPhotoModalProps) {
  const { onClose, onDelivery, visible } = props

  const [photos, setPhotos] = useState<Array<{ uri: string } | null>>(
    Array(4).fill(null)
  )
  const [isUploading, setIsUploading] = useState<boolean>(false)
  // const [uploadProgress, setUploadProgress] = useState<number>(0)

  const { ride } = useRide()

  const isDisabled = photos.filter(p => p).length < 4

  async function handleTakePhoto(index: number) {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled && result.assets?.length) {
        const newPhotos = [...photos]
        const { uri } = result.assets[0]
        newPhotos[index] = { uri }
        setPhotos(newPhotos)
      }
    } catch (error) {
      handleErrors(error)
    }
  }
  async function handleConfirmPhotos() {
    const validPhotos = photos.filter(photo => photo !== null)

    if (validPhotos.length < 4) {
      Alert.alert('Erro', 'Você precisa tirar 4 fotos antes de continuar.')
      return
    }

    try {
      setIsUploading(true)
      await sendPhotos(ride.id, validPhotos)
      await onDelivery()
    } catch (error) {
      handleErrors(error)
    } finally {
      setIsUploading(false)
    }
  }

  return {
    isUploading,
    isDisabled,
    visible,
    photos,
    onClose,
    handleTakePhoto,
    handleConfirmPhotos,
  }
}
