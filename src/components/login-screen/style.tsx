import { StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, useColorScheme } from 'react-native'

export const colors = {
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
}

export const styles = StyleSheet.create({
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
})
