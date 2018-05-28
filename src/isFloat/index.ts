/**
 * isFloat
 */


export function isFloat(value: string): boolean {
  return /^[-+]?\d+\.\d+$/.test(value)
}

export default isFloat