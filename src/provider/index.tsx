'use client'

import { useColorScheme } from 'react-native'
import { AuthProvider } from './auth'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DevToolsBubble } from 'react-native-react-query-devtools'
import { SocketProvider } from './socket'
import { RideProvider } from './rides'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RideProvider>
            <SocketProvider>{children}</SocketProvider>
          </RideProvider>
        </AuthProvider>
        {/* <DevToolsBubble /> */}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
