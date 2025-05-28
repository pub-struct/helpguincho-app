import { ValidationError } from '@/@types/Errors'
import { AxiosError } from 'axios'


export function getAxiosMessage(error: AxiosError<ValidationError, unknown>) {
  const detailError = error.response?.data.error
  const detailError2 = error.response?.data.detail
  // console.log('AXIOS ====>', error.response?.data.detail)
  const message = detailError || detailError2

  return message || error.message
}
