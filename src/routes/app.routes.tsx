import { RootStackParamList } from '@/@types/navigation'
import { DrawerLayout } from '@/layout/Drawer'
import { Home } from '@/screens/Home'
import { Profile } from '@/screens/Profile'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { History } from '@/screens/History'
import { Feather } from '@expo/vector-icons'
import { THEME } from '@/theme'
import { Text } from '@/components/Text'


const Drawer = createDrawerNavigator<RootStackParamList>()

export function AppRoutes() {
  const { COLORS } = THEME

  return (
    <Drawer.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        drawerStatusBarAnimation: 'fade',
        drawerActiveTintColor: COLORS.PRIMARY,
        drawerInactiveTintColor: COLORS.BUTTON_BG,
        drawerItemStyle: {
          borderRadius: 10
        }
      }}
      drawerContent={(props) => <DrawerLayout {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: ({ focused }) => (
            <Text color={focused ? 'TEXT' : 'BUTTON_BG'}>Home</Text>
          ),
          drawerIcon: ({ color }) => (
            <Feather name='home' size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: ({ focused }) => (
            <Text color={focused ? 'TEXT' : 'BUTTON_BG'}>Perfil</Text>
          ),
          drawerIcon: ({ color }) => (
            <Feather name='user' size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="History"
        component={History}
        options={{
          drawerLabel: ({ focused }) => (
            <Text color={focused ? 'TEXT' : 'BUTTON_BG'}>Histórico</Text>
          ),
          drawerIcon: ({ color }) => (
            <Feather name='clipboard' size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}
