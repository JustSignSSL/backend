import cors from 'cors'
import { origin } from '../config'

export default () => origin === "*" ? cors() : cors({ origin, optionsSuccessStatus: 200 })
