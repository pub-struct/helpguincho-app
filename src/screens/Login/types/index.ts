import * as yup from 'yup'
import { schema } from '../schema'


export type TFormData = yup.InferType<typeof schema>
