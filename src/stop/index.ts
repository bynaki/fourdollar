/**
 * stop
 */


export function stop(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}


export default stop
