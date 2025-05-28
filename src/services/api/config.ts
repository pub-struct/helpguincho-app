import axios from 'axios'
import { ENV } from '../../env'


export const API = axios.create({
  baseURL: ENV.BASE_URL
})
