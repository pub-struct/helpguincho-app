import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Text } from '../Text'
import { THEME } from '@/theme'
import { styles } from './styles'
import { ReactNode } from 'react'


export interface IButtonProps extends TouchableOpacityProps {
  title?: string
  variant?: 'primary' | 'outline' | 'gray'
  isLoading?: boolean
  children?: ReactNode
}


export function Button(props: IButtonProps) {
  const {
    isLoading,
    children,
    disabled,
    title,
    variant,
    style: RNStyle,
    ...otherProps
  } = props

  const style = styles(props)

  if (isLoading) {
    return (
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.5}
        style={[style.container, RNStyle]}
        disabled={isLoading}
        {...otherProps}
      >
        <ActivityIndicator color={THEME.COLORS.PLACEHOLDER} />
      </TouchableOpacity>
    )
  }

  if (children) {
    return (
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.5}
        style={[style.container, RNStyle]}
        disabled={isLoading}
        {...otherProps}
      >
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.5}
      style={[style.container, RNStyle]}
      disabled={isLoading || disabled}
      {...otherProps}
    >
      <Text
        size={15}
        weight='Medium_5'
        color={disabled ? 'PLACEHOLDER' : 'TEXT'}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}
