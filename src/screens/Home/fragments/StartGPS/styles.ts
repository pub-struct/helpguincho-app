import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30
  },
  content: {
    backgroundColor: COLORS.BACKGROUND_OPACITY_1,
    borderRadius: 20,
    width: '98%',
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.BACKGROUND
  },
  yellowDot: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 999,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
}))
