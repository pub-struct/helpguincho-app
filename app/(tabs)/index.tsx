import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingScreen from './LoadingScreen';
import HomeScreen from './HomeScreen'; // Certifique-se de que o caminho está correto
import LoginScreen from './LoginScreen'; // Certifique-se de que o caminho está correto
import { useRouter } from 'expo-router';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simula um tempo de carregamento (por exemplo, 3 segundos)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Limpa o timer ao desmontar o componente
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoginScreen />
    </GestureHandlerRootView>
  );
}