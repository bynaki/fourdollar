
/**
 * 문자열이 소수인지 아닌지
 * @param value 판단할 문자열
 * @returns 소수면 true, 아니면 false
 */
export function isFloat(value: string): boolean {
  return /^[-+]?\d+\.\d+$/.test(value)
}

/**
 * 문자열이 정수인지 아닌지
 * @param value 판단할 문자열
 * @returns 정수이면 true, 아니면 false
 */
export function isInteger(value: string): boolean {
  return /^[-+]?\d+$/.test(value)
}
