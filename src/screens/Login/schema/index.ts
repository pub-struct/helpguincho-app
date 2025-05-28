import * as yup from 'yup'


export const schema = yup.object({
  email: yup.string().email('Não tem algo errado?').required('E-mail obrigatório'),
  password: yup.string().min(8, 'O minimo é 8 caracteres').required('Senha obrigatório')
})
