import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import HomeScreen from './HomeScreen'
import LoginScreen from './LoginScreen'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <LoginScreen/> */}
      <HomeScreen />
    </GestureHandlerRootView>
  )
}
