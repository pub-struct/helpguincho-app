import { TouchableOpacity, View } from 'react-native'
import { styles } from './styles'
import { Feather } from '@expo/vector-icons'
import { THEME } from '@/theme'
import { Text } from '../Text'
import { ComponentProps } from 'react'
import { useNavigation } from '@react-navigation/native'


interface IHeaderProps {
  backButton?: boolean
  title: string
  iconRight?: ComponentProps<typeof Feather>['name']
  onActionRight?(): void
}

export function Header(props: IHeaderProps) {
  const { backButton, title, iconRight, onActionRight } = props
  const { COLORS } = THEME

  const { goBack } = useNavigation()

  return (
    <View style={styles.container}>
      {backButton ? (
        <TouchableOpacity style={styles.iconContainer} onPress={goBack}>
          <Feather
            name='arrow-left'
            size={24}
            color={COLORS.TEXT}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyContainer} />
      )}

      <View style={{ width: '60%' }}>
        <Text
          size={title.length > 20 ? 15 : 20}
          weight='Bold_7'
          align='center'
        >
          {title}
        </Text>
      </View>

      {iconRight ? (
        <TouchableOpacity style={styles.iconContainer} onPress={onActionRight}>
          <Feather
            name={iconRight}
            size={24}
            color={COLORS.TEXT}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyContainer} />
      )}
    </View>
  )
}
