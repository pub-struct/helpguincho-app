import { THEME } from '.'
import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native'

type CSSType = TextStyle | ViewStyle | ImageStyle
type NamedStyles = { [name: string]: CSSType }

export function Styler<T extends NamedStyles>(styles: (theme: typeof THEME) => T) {
  return StyleSheet.create(styles(THEME))
}
