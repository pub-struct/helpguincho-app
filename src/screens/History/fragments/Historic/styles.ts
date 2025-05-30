import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    elevation: 10,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10
  }
}))
