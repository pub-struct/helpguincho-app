import { Styler } from '@/theme/styler'


export const styles = (editable?: boolean) => Styler(({ COLORS }) => {
  const MIN_HEIGHT = 45

  return {
    mainContainer: {
      width: '100%',
      marginBottom: 10,
    },
    container: {
      width: '100%',
      minHeight: MIN_HEIGHT,
      paddingHorizontal: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: COLORS.BACKGROUND_OPACITY_1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: MIN_HEIGHT
    },
    input: {
      flex: 1,
      fontFamily: 'Lexend_400',
      fontSize: 16,
      minHeight: MIN_HEIGHT,
      color: COLORS[editable ? 'TEXT' : 'PLACEHOLDER']
    }
  }
})

