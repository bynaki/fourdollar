
/**
 * 멈춤
 * @param ms millisecond 동안 멈춤
 * @returns
 */
export function stop(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

/**
 * url get method stringify params
 * @param params param들
 * @returns 예: ?hell=world&foo=bar
 */
export function toStringQuery(params: object): string {
  if(typeof params === 'object') {
    const keys = Object.keys(params)
    if(keys.length === 0) {
      return ''
    }
    const esc = encodeURIComponent
    return '?' + Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')
  } else {
    return ''
  }
}
