import { Text as RNText, TextStyle, type TextProps } from 'react-native'
import { THEME } from '@/theme'


type DefaultTheme = typeof THEME

export type ITextProps = TextProps & {
  readonly weight?:  keyof DefaultTheme['WEIGHT']
  readonly color?: keyof DefaultTheme['COLORS']
  readonly hexColor?: string
  readonly size?: number
  readonly align?: TextStyle['textAlign']
}

export function Text(props: ITextProps) {
  const {
    style,
    weight,
    size,
    align,
    color,
    ...rest
  } = props

  return (
    <RNText
      style={[
        {
          fontFamily: weight ? `Lexend_${THEME.WEIGHT[weight]}` : 'Lexend_400',
          fontSize: size ?? 16,
          textAlign: align ?? 'auto',
          color: color ? THEME.COLORS[color] : THEME.COLORS.TEXT
        },
        style,
      ]}
      {...rest}
    />
  )
}
