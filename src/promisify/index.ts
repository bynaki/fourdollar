// promisify
//

/**
 * Callback 방식을 Promise 로 변환
 */
export function promisify<T>(
  func: Function, hasErr: any = true, ctx: any = undefined)
  : T & ((...any: any[]) => Promise<any>) {
  if(typeof hasErr !== 'boolean') {
    [hasErr, ctx] = [ctx, hasErr]
    if(hasErr === undefined) {
      hasErr = true
    }
  }
  if(typeof hasErr !== 'boolean') {
    throw new Error('argument 전달이 잘못됐다.')
  }

  return function(...args) {
    return new Promise((resolve: Function, reject: Function) => {
      const ff: Function = func.bind((ctx !== undefined)? ctx : this)
      try {
        ff(...args, (err, ...args) => {
            if(hasErr && err) {
              reject(err)
            } else if(hasErr) {
              resolve((args.length <= 1)? args[0] : [...args])
            } else {
              resolve((args.length == 0)? err : [err, ...args])
            }
        })
      } catch(err) {
        if(hasErr) {
          reject(err)
        } else {
          throw err
        }
      }
    })
  } as any
}

export default promisify