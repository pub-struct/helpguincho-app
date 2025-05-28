import { RootStackParamList } from '@/@types/navigation'
import { Home } from '@/screens/Home'
import { createDrawerNavigator } from '@react-navigation/drawer'


const Drawer = createDrawerNavigator<RootStackParamList>()

export function AppRoutes() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStatusBarAnimation: 'fade'
        // animation: 'slide_from_bottom'
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  )
}
