import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  container: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PLACEHOLDER
  },
  emptyContainer: {
    width: '20%',
    height: 70,
  },
  iconContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  }
}))

