import { Controller, UseControllerProps, FieldValues } from 'react-hook-form'
//COMPONENTS
import { Input, IInputProps } from '@/components/Input'
import { Text } from '@/components/Text'


type TProps<T extends FieldValues> = UseControllerProps<T> & IInputProps & {
  onPress?: VoidFunction
  defaultValueControl?: UseControllerProps<T>['defaultValue']
  // interceptorText?: (e: string) => string
}

export function ControlledInput<T extends FieldValues>(props: TProps<T>) {
  const {
    name,
    rules,
    control,
    disabled,
    shouldUnregister,
    defaultValueControl,
    onPress,
    ...restProps
  } = props

  const controlProps = {
    name,
    rules,
    control,
    disabled,
    shouldUnregister,
    defaultValueControl,
  }

  return (
    <Controller
      {...controlProps}
      render={({
        field: { onChange, value },
        fieldState: { invalid, error }
      }) => (
        <Input
          onPress={onPress}
          onChangeText={e => onChange(e)}
          // onChangeText={e => onChange(interceptorText?.(e) ?? e)}
          editable={!disabled}
          value={value}
          disabled={disabled}
          message={!!invalid && (
            <Text
              size={12}
              color='RED'
              weight='Medium_5'
              align='left'
            >
              {error?.message}
            </Text>
          )}
          {...restProps}
        />
      )}
    />
  )
}
