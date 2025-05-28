import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './app.routes'
import { Login } from '@/screens/Login/screen'
import { LayoutChangeEvent, View } from 'react-native'
import Toast, { BaseToast, ErrorToast, ToastProps, InfoToast } from 'react-native-toast-message'
import { THEME } from '@/theme'
import { useAuth } from '@/hooks/useAuth'


interface IRoute {
  onLayout(event: LayoutChangeEvent): void
}

export function Routes(props: IRoute) {
  const { isAuthenticated } = useAuth()

  const toastConfig = {
    success: (props: ToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: THEME.COLORS.GREEN,
          height: 'auto',
          minHeight: 70
        }}
        contentContainerStyle={{
          height: 'auto',
          flexWrap: 'wrap',
        }}
        text1Style={{
          fontSize: 16,
        }}
        text2Style={{
          fontSize: 14,
          flexWrap: 'wrap',
          width: '100%',
        }}
        text2NumberOfLines={25}
      />
    ),
    error: (props: ToastProps) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: THEME.COLORS.RED,
          height: 'auto',
          minHeight: 70
        }}
        contentContainerStyle={{
          height: 'auto',
          flexWrap: 'wrap',
        }}
        text1Style={{
          fontSize: 16,
        }}
        text2Style={{
          fontSize: 14,
          flexWrap: 'wrap',
          width: '100%',
        }}
        text2NumberOfLines={25}
      />
    ),
    info: (props: ToastProps) => (
      <InfoToast
        {...props}
        style={{
          borderLeftColor: THEME.COLORS.BLUE,
          height: 'auto',
          minHeight: 70
        }}
        contentContainerStyle={{
          height: 'auto',
          flexWrap: 'wrap',
        }}
        text1Style={{
          fontSize: 16,
        }}
        text2Style={{
          fontSize: 14,
          flexWrap: 'wrap',
          width: '100%',
        }}
        text2NumberOfLines={25}
      />
    )
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: THEME.COLORS.BACKGROUND }}
      // onLayout={props.onLayout}
    >
      <NavigationContainer>
        {isAuthenticated ? <AppRoutes /> : <Login />}
      </NavigationContainer>

      <Toast config={toastConfig} />
    </View>
  )
}
