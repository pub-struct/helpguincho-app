import { ScrollView, TextInput, TouchableOpacity, useColorScheme, Image } from 'react-native'
import { colors, styles } from './style'
import { useAuth } from '@/hooks/auth'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, LoginSchemaType } from './schema'
export const LonginScreen = () => {
  const colorScheme = useColorScheme()
  const themeColors = colors[colorScheme || 'light'] // Define as cores com base no tema
  const { login } = useAuth()
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  })
  const onSubmit = async (data: LoginSchemaType) => {
    await login(data.email, data.password)
  }
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}>
      <ThemedView style={styles.loginContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle" style={[styles.welcomeText, { color: themeColors.text }]}>
            BEM VINDO!
          </ThemedText>
        </ThemedView>
        <ThemedText style={[styles.label, { color: themeColors.text }]}>E-mail</ThemedText>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.inputBackground,
                  borderColor: themeColors.inputBorder,
                  color: themeColors.text,
                },
              ]}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              placeholder="example@email.com"
              placeholderTextColor={themeColors.text}
              keyboardType="email-address"
              textContentType="emailAddress"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <ThemedText style={[styles.label, { color: themeColors.text }]}>Senha</ThemedText>
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.inputBackground,
                  borderColor: themeColors.inputBorder,
                  color: themeColors.text,
                },
              ]}
              placeholder="Senha"
              placeholderTextColor={themeColors.text}
              secureTextEntry={true}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.buttonBackground }]}
          // onPress={handleLogin}
          onPress={async () => {
            await onSubmit(form.getValues())
          }}
        >
          <ThemedText style={[styles.buttonText, { color: themeColors.buttonText }]}>Entrar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  )
}
