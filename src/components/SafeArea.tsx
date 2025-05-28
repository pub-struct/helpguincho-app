import { ReactNode } from 'react'
import { Platform, SafeAreaView, StatusBar, ViewProps } from 'react-native'


interface IProps {
  children: ReactNode
  style?: ViewProps['style']
}
export function SafeArea({ children, style }: IProps) {
  const isAndroid = Platform.OS === 'android'

  return (
    <SafeAreaView
      style={[
        {
          paddingTop: isAndroid ? StatusBar.currentHeight : 0,
          flex: 1
        },
        style
      ]}
    >
      {children}
    </SafeAreaView>
  )
}
