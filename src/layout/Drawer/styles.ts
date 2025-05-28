import { Styler } from '@/theme/styler'
import { Dimensions, Platform, StatusBar } from 'react-native'


const { height } = Dimensions.get('window')
const isAndroid = Platform.OS === 'android'

export const styles = Styler(({ COLORS }) => ({
  drawerContainer: {
    height: height * 0.5,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
    paddingTop: isAndroid ? (StatusBar.currentHeight || 20) + 20 : 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}))
