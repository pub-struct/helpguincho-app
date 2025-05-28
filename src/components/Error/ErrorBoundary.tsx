import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import * as Updates from 'expo-updates'
// import { loggerErrors } from '@/services/logger'
import { BaseError } from '@/services/errors/BaseError'
import { Button } from '../Button'
import { Text } from '../Text'
import { THEME } from '@/theme'
import { styles } from './styles'


type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  isRestarting: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, isRestarting: false }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true, isRestarting: false }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // loggerErrors(error as BaseError, { name: 'ErrorBoundary', ...info })
    console.error('Erro capturado pelo ErrorBoundary:', error, info)
  }

  handleRetry = async () => {
    this.setState({ isRestarting: true })

    try {
      await Updates.reloadAsync() // Reinicia o app
    } catch (error) {
      console.error('Erro ao reiniciar o app:', error)
      this.setState({ isRestarting: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text size={20} weight='Bold_7' style={{ marginBottom: 10 }}>
            😓 Algo deu errado
          </Text>
          <Text size={14} align='center' style={{ marginBottom: 10 }}>
            Ja registramos o erro
          </Text>

          {this.state.isRestarting ? (
            <Text size={14} align='center' style={{ marginBottom: 20 }}>
              Estamos reiniciando o app.
            </Text>
          ) : (
            <Text size={14} align='center' style={{ marginBottom: 20 }}>
              reinicie o app.
            </Text>
          )}

          {this.state.isRestarting ? (
            <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} style={{ marginTop: 30 }} />
          ) : (
            <Button title='Tentar Novamente' onPress={this.handleRetry} />
          )}
        </View>
      )
    }

    return this.props.children
  }
}
