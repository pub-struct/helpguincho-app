import { DrawerScreenProps } from '@react-navigation/drawer'


export declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined
  Profile: undefined
  History: undefined
}

export type TScreen<T extends keyof RootStackParamList> = DrawerScreenProps<RootStackParamList, T>
