import { RideContext } from '@/context/ride'
import RidesService from '@/infra/services/rides'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  const [ride, setRide] = useState<Ride | null>(null)
  const { mutate } = useMutation({
    mutationKey: ['ride', ride],
    mutationFn: async () => {
      if (!ride?.id) {
        return
      }
      const res = await new RidesService().acceptRide(ride?.id)
      if (res.statusCode !== 200) {
        console.log(res.body)
        throw new Error('Erro ao aceitar corrida')
      }
    },
    onError: (error) => {
      console.error(error)
    },
    onSuccess: () => {
      console.log('Corrida aceita com sucesso')
    },
  })
  return (
    <RideContext.Provider value={{ ride, setRide }}>
      {!!ride ? (
        <View style={styles.corridaContainer}>
          <Text style={styles.corridaTitle}>Nova Corrida</Text>
          <Text style={styles.corridaText}>Cliente: {ride?.client?.full_name}</Text>
          <Text style={styles.corridaText}>Veículo: {ride?.client?.vehicle}</Text>
          <Text style={styles.corridaText}>Placa: {ride?.client?.plate}</Text>
          <Text style={styles.corridaText}>Local de coleta: {ride?.pickup_location}</Text>
          <Text style={styles.corridaText}>Local de entrega: {ride?.delivery_address}</Text>
          <Text style={styles.corridaText}>Descrição: {ride?.description}</Text>
          <Text style={styles.corridaText}>Preço: R$ {ride?.price}</Text>
          <View style={styles.corridaButtonsContainer}>
            <TouchableOpacity style={styles.corridaButton}>
              <Text style={styles.corridaButtonText}>Recusar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.corridaButton, { backgroundColor: '#2ecc71' }]}
              onPress={() => {
                mutate()
              }}
            >
              <Text style={styles.corridaButtonText}>Aceitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        children
      )}
    </RideContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    position: 'relative',
  },
  corridaContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
  },
  corridaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  corridaText: {
    fontSize: 14,
    marginBottom: 5,
  },
  corridaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  corridaButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  corridaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  newHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuButton: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    padding: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#000',
  },
  welcomeContainer: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBox: {
    position: 'absolute',
    alignSelf: 'center',
    top: 120,
    width: '90%',
    borderRadius: 10,
    padding: 16,
    zIndex: 2,
    overflow: 'hidden',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFF',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 8,
  },
  statusDesc: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  statusButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sheetBackground: {
    backgroundColor: '#fff',
  },
  sheetContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sheetBackButton: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    width: 120,
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIcon: {
    width: 44,
    height: 44,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 6,
  },
  value: {
    color: '#555',
    marginBottom: 6,
  },
  historicoItem: {
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  historicoData: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  historicoInfo: {
    fontSize: 13,
    color: '#555',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    zIndex: 1000,
  },
  drawerContainer: {
    height: height * 0.5,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerContent: {
    flex: 1,
  },
  drawerItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
})
