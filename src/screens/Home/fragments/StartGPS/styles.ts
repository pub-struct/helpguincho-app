import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: '100%',
    padding: 18
  }
}))
