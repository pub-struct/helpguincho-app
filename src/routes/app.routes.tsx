import { RootStackParamList } from '@/@types/navigation'
import { DrawerLayout } from '@/layout/Drawer'
import { Home } from '@/screens/Home'
import { Profile } from '@/screens/Profile'
import { createDrawerNavigator } from '@react-navigation/drawer'


const Drawer = createDrawerNavigator<RootStackParamList>()

export function AppRoutes() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStatusBarAnimation: 'fade'
      }}
      drawerContent={(props) => <DrawerLayout {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: 'Conta'
        }}
      />
    </Drawer.Navigator>
  )
}
