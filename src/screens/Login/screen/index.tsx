import { ScrollView } from 'react-native'
import { Text } from '@/components/Text'
import { styles } from './styles'
import { IMAGES } from '@/constants/images'
import { Button } from '@/components/Button'
import { ControlledInput } from '@/controllers/Input'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { TFormData } from '../types'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../schema'
import { handleErrors } from '@/services/errors/ErrorHandler'
import { useState } from 'react'
import { login } from '../services/api'


export function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { control, handleSubmit } = useForm<TFormData>({
    resolver: yupResolver(schema)
  })

  const { onAuthenticate, onUpdateUser } = useAuth()

  const { SVGS } = IMAGES

  async function onSubmit(data: TFormData) {
    try {
      setIsLoading(true)
      const response = await login(data)
      // console.log('TOKEN API =====>', response.token)
      onUpdateUser(response.factoryData)
      await onAuthenticate(response.token)
    } catch (error) {
      handleErrors(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps='handled'
    >
      <SVGS.Logo width={300} height={300} style={{ marginTop: 30 }} />

      <Text weight='Bold_7' size={30} style={{ marginBottom: 10 }}>
        BEM VINDO!!
      </Text>

      <ControlledInput
        control={control}
        name='email'
        label='E-mail'
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        placeholder="example@email.com"
        keyboardType="email-address"
        textContentType="emailAddress"
        icon='mail'
      />

      <ControlledInput
        control={control}
        name='password'
        label='Senha'
        placeholder='*******'
        icon='lock'
        isPassword
      />

      <Button
        isLoading={isLoading}
        title='Entrar'
        onPress={handleSubmit(onSubmit)}
      />
    </ScrollView>
  )
}
