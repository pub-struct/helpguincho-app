import { Input } from '@/components/Input'
import { Text } from '@/components/Text'
import { useAuth } from '@/hooks/useAuth'
import { View } from 'react-native'


export function UserInfos() {
  const { user } = useAuth()

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
      <Text weight='Bold_7'>Informações pessoais</Text>

      <View style={{ marginTop: 10 }}>
        <Input
          label='Nome'
          value={user.full_name}
          readOnly
          editable={false}
        />
        <Input
          label='E-mail'
          value={user.email}
          readOnly
          editable={false}
        />
        <Input
          label='CNH'
          value={user.cnh}
          readOnly
          editable={false}
        />
        <Input
          label='Telefone'
          value={user.phone}
          readOnly
          editable={false}
        />
      </View>

      <Text weight='Bold_7'>
        Guincho - {user.vehicle.is_active ? 'Ativo' : 'Desativo'}
      </Text>

      <View style={{ marginTop: 10 }}>
        <Input
          label='Marca'
          value={user.vehicle.brand}
          readOnly
          editable={false}
        />
        <Input
          label='Modelo'
          value={user.vehicle.model + ' - ' + user.vehicle.year}
          readOnly
          numberOfLines={4}
          multiline
          editable={false}
        />
        <Input
          label='Placa'
          value={user.vehicle.plate}
          readOnly
          editable={false}
        />
      </View>
    </View>
  )
}
