import {
  DefaultWriter,
  FileWriter,
} from '.'
import {
  IWriter,
} from './Logger'




export function logger()
export function logger(writer: IWriter)
export function logger(path: string, interval?: string)
export function logger(...args: unknown[]) {
  let w: IWriter
  if(args.length === 0) {
    w = new DefaultWriter()
  } else if(typeof(args[0]) === 'string') {
    w = new FileWriter(args[0], args[1] as string | undefined)
  } else {
    w = args[0] as IWriter
  }
  return (target, property, descriptor) => {
    const method = descriptor.value
    descriptor.value = function(...args): unknown {
      const chunk = method.apply(this, args)
      if(!chunk) {
        return chunk
      }
      let suited: string
      if(typeof(chunk) === 'string') {
        suited = chunk
      } else if(chunk instanceof Error) {
        suited = JSON.stringify({
          name: chunk.name,
          message: chunk.message,
          stack: chunk.stack,
        }, null, 2)
      } else {
        try {
          suited = JSON.stringify(chunk, null, 2)
        } catch(err) {
          suited = JSON.stringify({
            name: chunk.name,
            message: chunk.message,
            stack: chunk.stack,
          }, null, 2)
        }
      }
      let ww: IWriter | undefined = w
      while(ww) {
        ww.write(suited)
        ww = ww.link
      }
      return chunk
    }
    descriptor.value.writer = w
  }
}
