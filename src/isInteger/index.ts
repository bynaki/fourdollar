/**
 * isInteger
 */


export function isInteger(value: string): boolean {
  return /^[-+]?\d+$/.test(value)
}

export default isInteger