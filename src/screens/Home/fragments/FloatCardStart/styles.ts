import { Styler } from '@/theme/styler'
import { Dimensions } from 'react-native'


const { height } = Dimensions.get('window')

export const styles = Styler(({ COLORS }) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height,
    zIndex: 1000,
    justifyContent: 'center',
  },
  initialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20
  },
  initialButton: {
    backgroundColor: COLORS.BACKGROUND,
    width: '48%',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 10
  },
  statusBox: {
    position: 'absolute',
    alignSelf: 'center',
    width: '97%',
    borderRadius: 10,
  },
  blurContainer: {
    borderRadius: 10,
    padding: 13,
    backgroundColor: COLORS.BACKGROUND_OPACITY_1,
    borderWidth: 1,
    borderColor: COLORS.BORDER
  },
  statusButton: {
    borderRadius: 6,
    width: '100%',
    height: 50
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    elevation: 6,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
    borderRadius: 10
  },
  animatedBtn: {
    backgroundColor: COLORS.BACKGROUND,
    height: '100%',
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  }
}))
