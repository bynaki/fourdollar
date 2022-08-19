import {
  DefaultWriter,
  FileWriter,
} from '.'
import {
  IWriter,
} from './Logger'



function logHelper(...args: any[]): (msg: any) => void {
  let w: IWriter
  if(args.length === 0) {
    w = new DefaultWriter()
  } else if(typeof(args[0]) === 'string') {
    w = new FileWriter(args[0], args[1] as string | undefined)
  } else {
    w = args[0] as IWriter
  }
  const f = (msg: any): void => {
    let suited: string
    switch(typeof(msg)) {
      case 'string': {
        suited = msg
        break
      }
      case 'number': {
        suited = msg.toString()
        break
      }
      case 'boolean': {
        suited = (msg)? 'true' : 'false'
        break
      }
      default: {
        if(msg === undefined) {
          suited = 'undefined'
        } else if(msg === null) {
          suited = 'null'
        } else if(msg instanceof Error) {
          suited = JSON.stringify({
            name: msg.name,
            message: msg.message,
            stack: msg.stack,
          }, null, 2)
        } else {
          try {
            suited = JSON.stringify(msg, null, 2)
          } catch(err) {
            suited = '지원하는 type이 아니다.'
          }
        }
      }
    }
    let ww: IWriter | undefined = w
    while(ww) {
      ww.write(suited)
      ww = ww.link
    }
  }
  f.writer = w
  return f
}



export function logger()
export function logger(writer: IWriter)
export function logger(path: string, interval?: string)
// export function logger(...args: any[]) {
//   const helper = logHelper(...args)
//   return (target: any, property: string, descriptor: PropertyDescriptor) => {
//     const method = descriptor.value
//     descriptor.value = (...args) => {
//       const chunk = method.apply(this, args)
//       helper(chunk)
//       return chunk
//     }
//     descriptor.value.writer = helper['writer']
//   }
// }

export function logger(...args: any[]) {
  let writer: IWriter
  if(args.length === 0) {
    writer = new DefaultWriter()
  } else if(typeof(args[0]) === 'string') {
    writer = new FileWriter(args[0], args[1])
  } else {
    writer = args[0]
  }
  return (target: any, property: string, descriptor: TypedPropertyDescriptor<any>) => {
    const method = descriptor.value
    descriptor.value = (...args) => {
      const chunk = method.apply(target, args)
      let w = writer
      while(w) {
        w.write(chunk)
        w = w.link
      }
      return chunk
    }
    descriptor.value.writer = writer
  }
}

export function getLogger(): (msg: any) => void
export function getLogger(writer: IWriter): (msg: any) => void
export function getLogger(path: string, interval?: string): (msg: any) => void
export function getLogger(...args: any[]): (msg: any) => void {
  return logHelper(...args)
}