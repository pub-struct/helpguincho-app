import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, useColorScheme } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useAuth } from '@/hooks/auth'
import { LonginScreen } from '@/components/login-screen'

export default function Screen() {
  return <LonginScreen />
}
