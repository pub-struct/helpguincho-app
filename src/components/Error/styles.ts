
import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.BACKGROUND
  }
}))
