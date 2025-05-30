import { RootStackParamList } from '@/@types/navigation'
import { DrawerLayout } from '@/layout/Drawer'
import { Home } from '@/screens/Home'
import { Profile } from '@/screens/Profile'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { History } from '@/screens/History'


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
      <Drawer.Screen
        name="History"
        component={History}
        options={{
          drawerLabel: 'Histórico'
        }}
      />
    </Drawer.Navigator>
  )
}
