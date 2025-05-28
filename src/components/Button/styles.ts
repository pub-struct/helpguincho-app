import { Styler } from '@/theme/styler'
import { IButtonProps } from '.'


export const styles = (params: IButtonProps) => Styler(({ COLORS }) => {
  const { variant, isLoading } = params

  const bg = variant === 'gray'
    ? COLORS.BUTTON_BG
    : variant === 'outline'
      ? COLORS.BACKGROUND
      : COLORS.PRIMARY

  return {
    container: {
      width: '100%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: isLoading ? `${bg}59` : bg,
      marginTop: 10,
      borderWidth: 1,
      borderColor: variant === 'outline' ? COLORS.TEXT : bg,
    }
  }
})
