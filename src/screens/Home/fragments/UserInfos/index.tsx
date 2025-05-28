import { Input } from '@/components/Input'
import { Text } from '@/components/Text'
import { View } from 'react-native'


export function UserInfos() {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <Text weight='Bold_7'>Informações pessoais</Text>

      <View style={{ marginTop: 10 }}>
        <Input
          label='Nome'
          value='Vinicius Celestino'
          readOnly
          editable={false}
        />
        <Input
          label='E-mail'
          value='vinigtr386@gmail.com'
          readOnly
          editable={false}
        />
        {/* <Input
          label='CNH'
          value='A / B'
          readOnly
          editable={false}
        />
        <Input
          label='Telefone'
          value='(19) 98310-0871'
          readOnly
          editable={false}
        /> */}
      </View>

      <Text weight='Bold_7'>Guincho</Text>

      <View style={{ marginTop: 10 }}>
        <Input
          label='Cor'
          value='Branco'
          readOnly
          editable={false}
        />
        <Input
          label='Placa'
          value='XXX-XXXX'
          readOnly
          editable={false}
        />
        <Input
          label='Modelo'
          value='Branco'
          readOnly
          editable={false}
        />
      </View>
    </View>
  )
}
