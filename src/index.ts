// fourdollar
//

import promisify from './promisify'
import {
  isFloat,
  isInteger,
} from './numbers'
import {
  Logger,
  DefaultWriter,
} from './Logger'
import {
  FileWriter,
} from './FileWriter'
import {
  Timer,
} from './Timer'
import {
  stop,
  toStringQuery,
} from './utils'
import {
  logger,
} from './logger.v2'


export {
  promisify,
  isInteger,
  isFloat,
  toStringQuery,
  Logger,
  DefaultWriter,
  FileWriter,
  Timer,
  stop,
  logger,
}

export default {
  promisify,
  isInteger,
  isFloat,
  toStringQuery,
  Logger,
  FileWriter,
  Timer,
  stop,
  logger,
}