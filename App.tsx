/* eslint-disable import/no-default-export */
import { AuthProvider } from '@/context/AuthContext'
import { Routes } from '@/routes'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Text } from '@/components/Text'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RideProvider } from '@/context/RideContext'
import { registerGlobalErrorHandler } from '@/services/errors/registerGlobalErrorHandler'
import { ErrorBoundary } from '@/components/Error/ErrorBoundary'
import { SocketProvider } from '@/context/SocketContext'


registerGlobalErrorHandler()
// SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({
  duration: 100,
  fade: true,
})


export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Lexend_100: require('./src/assets/fonts/Lexend-Thin.ttf'),
    Lexend_200: require('./src/assets/fonts/Lexend-ExtraLight.ttf'),
    Lexend_300: require('./src/assets/fonts/Lexend-Light.ttf'),
    Lexend_400: require('./src/assets/fonts/Lexend-Regular.ttf'),
    Lexend_500: require('./src/assets/fonts/Lexend-Medium.ttf'),
    Lexend_600: require('./src/assets/fonts/Lexend-SemiBold.ttf'),
    Lexend_700: require('./src/assets/fonts/Lexend-Bold.ttf'),
    Lexend_800: require('./src/assets/fonts/Lexend-ExtraBold.ttf'),
    Lexend_900: require('./src/assets/fonts/Lexend-Black.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontsError])
  // console.log('FONTS -->', fontsLoaded)
  if (fontsError) {
    return (
      <View>
        <Text>ALGO DEU ERRADO</Text>
      </View>
    )
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView>
        <AuthProvider>
          <RideProvider>
            <SocketProvider>
              <StatusBar style="auto" animated />
              <Routes onLayout={onLayoutRootView} />
            </SocketProvider>
          </RideProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}
