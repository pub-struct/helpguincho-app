import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_OPACITY_1, // overlay escuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderTop: {
    width: '95%',
    borderRadius: 10,
    paddingTop: 5,
    backgroundColor: COLORS.PRIMARY
  },
  content: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    padding: 24,
    width: '100%',
  },
}))
