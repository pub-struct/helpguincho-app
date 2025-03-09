import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, View, useColorScheme, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Importe o useRouter do Expo Router

export default function LoginScreen() {
  const colorScheme = useColorScheme(); // Obtém o tema atual (light ou dark)
  const themeColors = colors[colorScheme || 'light']; // Define as cores com base no tema
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Hook navegação do Expo Router

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://api.help-guincho.co/api/v1/auth/login/', {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // login for bem sucedido, token no AsyncStorage.
      const token = response.data.token; 
      await AsyncStorage.setItem('token', token);

      console.log('Login bem-sucedido:', response.data);

      // redirecionar para a tela Home com expo
      router.replace('/HomeScreen'); // replace para evitar que o usuário volte para a tela de login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}>
      <ThemedView style={styles.loginContainer}>
        <Image
          source={require('@/assets/images/logo.png')} // Substitua pelo caminho da sua logo
          style={styles.logo}
        />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle" style={[styles.welcomeText, { color: themeColors.text }]}>BEM VINDO!</ThemedText>
        </ThemedView>
        <ThemedText style={[styles.label, { color: themeColors.text }]}>E-mail</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.inputBackground, borderColor: themeColors.inputBorder, color: themeColors.text }]}
          placeholder="Email@email.com"
          placeholderTextColor={themeColors.text}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <ThemedText style={[styles.label, { color: themeColors.text }]}>Senha</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.inputBackground, borderColor: themeColors.inputBorder, color: themeColors.text }]}
          placeholder="Senha"
          placeholderTextColor={themeColors.text}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: themeColors.buttonBackground }]}
          onPress={handleLogin}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>Entrar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const colors = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    inputBackground: '#FFFFFF',
    inputBorder: '#ccc',
    buttonBackground: '#ffc400',
    buttonText: '#000000',
  },
  dark: {
    background: '#1E1E1E',
    text: '#FFFFFF',
    inputBackground: '#2E2E2E',
    inputBorder: '#444',
    buttonBackground: '#ffc400',
    buttonText: '#000000',
  },
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexGrow: 1,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 1,
    marginTop: 80,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 200,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});