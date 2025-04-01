'use client';
import { AuthContext } from '@/context/auth';
import { HttpStatusCode } from '@/infra';
import AuthService from '@/infra/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import LoadingScreen from '@/app/(tabs)/LoadingScreen';
import { Alert } from 'react-native';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await new AuthService().login({ email, password });
      console.log('Resposta da API:', response); 

      if (response.statusCode === HttpStatusCode.unauthorized) {
        Alert.alert('Não encontramos nenhum usuário com essas credenciais, verifique suas credenciais');
        return;
      }

      if (response.body.role !== 'driver' /* && response.body.role !== 'admin' */) {
        console.log('Role do usuário:', response.body.role); 
        Alert.alert('Você não tem permissão para acessar essa página, precisa ser um motorista cadastrado.');
        return;
      }

      
      await AsyncStorage.setItem('token', response.body.token);
      console.log('Token armazenado:', response.body.token); 

      
      setUser(response.body);

      
      router.push('/HomeScreen');
    } catch (error) {
      console.error('Erro durante o login:', error); 
      Alert.alert('Erro ao fazer login. Tente novamente.');
    }
  };

  const logout = async () => {
    try {
      const res = await new AuthService().logout();
      console.log('Resposta do logout:', res); 

      await AsyncStorage.removeItem('token');
      console.log('Token removido'); 

      setUser(null);
      router.replace('/LoginScreen'); 
    } catch (error) {
      console.error('Erro durante o logout:', error); 
    }
  };

  const session = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/LoginScreen');
        return {};
      }

      const res = await new AuthService().session();
      //console.log('Resposta da sessão:', res); 

      if (res.statusCode !== 200) {
        await AsyncStorage.removeItem('token'); 
        router.push('/LoginScreen');
        return {};
      }

      setUser(res.body);
      return res;
    },
  });

  if (session.isPending) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};