import { ComponentProps, ReactNode, Ref, useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View, ViewProps } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Text } from '../Text'
import { styles } from './styles'
import { THEME } from '@/theme'


export interface IInputProps extends TextInputProps {
  disableOnFocus?: boolean
  icon?: ComponentProps<typeof Feather>['name']
  onPress?: VoidFunction
  innerRef?: Ref<TextInput>
  containerProps?: ViewProps
  inputContainerProps?: ViewProps
  label?: string
  disabled?: boolean
  isPassword?: boolean
  message?: ReactNode
}

export function Input(props: IInputProps) {
  const {
    label,
    disabled = false,
    editable = true,
    readOnly = false,
    isPassword = false,
    disableOnFocus,
    message,
    onPress,
    ...rest
  } = props

  const [isEye, setIsEye] = useState<boolean>(isPassword)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)

  const style = styles(editable)
  const { COLORS } = THEME

  const isDisabled = disabled || !editable || readOnly

  const handleInputFocus = () => setIsFocused(true)
  const handleVisible = () => setIsEye(!isEye)

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!props.value)
  }

  return (
    <View style={style.mainContainer}>
      {label && <Text>{label}</Text>}

      <View style={style.container} {...props.containerProps}>
        {props.icon && (
          <TouchableOpacity disabled={isDisabled} onPress={onPress}>
            <Feather
              name={props.icon}
              size={20}
              color={disableOnFocus ?
                COLORS.PLACEHOLDER :
                (isFocused || isFilled) ? COLORS.PRIMARY : COLORS.TEXT}
            />
          </TouchableOpacity>
        )}

        <TextInput
          style={style.input}
          ref={props.innerRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          editable={editable}
          secureTextEntry={isEye}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            style={style.iconContainer}
            onPress={handleVisible}
          >
            <Feather
              size={20}
              name={isEye ? 'eye' : 'eye-off'}
              color={disableOnFocus ?
                COLORS.PLACEHOLDER :
                (isFocused || isFilled) ? COLORS.PRIMARY : COLORS.TEXT}
            />
          </TouchableOpacity>
        )}
      </View>

      {message}
    </View>
  )
}
