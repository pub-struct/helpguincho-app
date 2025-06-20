import { View, StyleSheet, ActivityIndicator } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps'
import { SafeArea } from '@/components/SafeArea'
import { Header } from '../fragments/Header'
import { FloatCardStart } from '../fragments/FloatCardStart'
import { OrderModal } from '../fragments/OrderModal'
import { StartGPS } from '../fragments/StartGPS'
import { Button } from '@/components/Button'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TScreen } from '@/@types/navigation'
import { styles } from './styles'
import { useScreen } from './useScreen'
import { Text } from '@/components/Text'


export function Home(navParams: TScreen<'Home'>) {
  const {
    requestUserPermissions,
    handleOrderVisible,
    getUserPosition,
    toggleDrawer,
    onUpdateMap,
    onFinish,
    onRequestNotifications,
    route,
    mapRef,
    status,
    orderInfos,
    rideCoords,
    isRideActive,
    orderVisible,
    userLocation,
    isNotificationEnabled,
  } = useScreen(navParams)

  if (!status || !status.granted) {
    return (
      <SafeArea>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Autorize o uso do GPS para utilizar o app</Text>
          <Button title="Solicitar permissão" onPress={requestUserPermissions} />
        </View>
      </SafeArea>
    )
  }

  if (!userLocation) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1, ...StyleSheet.absoluteFillObject }}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 0,
          longitude: userLocation ? userLocation.longitude : 0,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton={false}
      >
        {rideCoords && (
          <Marker
            coordinate={{
              latitude: rideCoords.latitude,
              longitude: rideCoords.longitude,
            }}
          />
        )}

        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>

      <SafeArea>
        <Header
          onOpenDrawer={toggleDrawer}
          onRequestNotifications={onRequestNotifications}
          isNotificationEnabled={isNotificationEnabled}
        />

        <Button style={styles.centerGPS} onPress={getUserPosition}>
          <MaterialCommunityIcons name="target" size={25} color="black" />
        </Button>

        {/* <Button title='TESTE' onPress={onTestRide} /> */}
        {!isRideActive && <FloatCardStart />}
        {isRideActive && <StartGPS onUpdateMap={onUpdateMap} onFinish={onFinish} />}
      </SafeArea>

      <OrderModal
        visible={orderVisible}
        onClose={handleOrderVisible}
        onUpdateMap={onUpdateMap}
        {...orderInfos}
      />
    </View>
  )
}
