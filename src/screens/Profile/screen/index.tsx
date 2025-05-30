import { Header } from '@/components/Header'
import { SafeArea } from '@/components/SafeArea'
import { Text } from '@/components/Text'
import { ActivityIndicator, ScrollView, View, RefreshControl } from 'react-native'
import { UserInfos } from '../fragments/UserInfos'
import { useState } from 'react'
import { handleErrors } from '@/services/errors/ErrorHandler'
import { THEME } from '@/theme'
import { getUserProfile } from '../services/api'
import { useAuth } from '@/hooks/useAuth'


export function Profile() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { COLORS } = THEME
  const { onUpdateUser } = useAuth()

  async function onActionRight() {
    try {
      setIsLoading(true)

      const response = await getUserProfile()
      onUpdateUser(response)
    } catch (error) {
      handleErrors(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <SafeArea>
        <Header
          title='Perfil'
          backButton
        />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={50} color={COLORS.PRIMARY} />
          <Text>Carregando...</Text>
        </View>
      </SafeArea>
    )
  }

  return (
    <SafeArea>
      <Header
        title='Perfil'
        backButton
        iconRight='refresh-ccw'
        onActionRight={onActionRight}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onActionRight}
            colors={[COLORS.PRIMARY]}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <UserInfos />
      </ScrollView>
    </SafeArea>
  )
}
