/**
 * url get method stringify params
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

export default toStringQuery
