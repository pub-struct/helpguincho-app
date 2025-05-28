import { Styler } from '@/theme/styler'


export const styles = Styler(({ COLORS }) => ({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_OPACITY_1, // overlay escuro
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: '100%',
    padding: 18
  },
  popup: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLORS.RED_OPACITY,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 4
  },
  userImgContainer: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: COLORS.PLACEHOLDER,
    borderRadius: 10,
    padding: 2
  },
  userImg: {
    width: '100%',
    height: '100%'
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 104,
    gap: 8
  },
  footerRightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  }
}))
