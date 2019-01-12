/* @flow */
export const toSnakeCase = (value: string): string =>
  value.replace(/([^A-Z_])([A-Z])/g, '$1_$2').replace(/\s/g, '')

export const getActionType = (prefix: string, name: string): string => {
  const before = prefix ? `${prefix}/` : ''
  return `${before}${toSnakeCase(name).toUpperCase()}`
}

export const isObject = (value: any): boolean =>
  !!value && value.constructor === Object

export const isFunction = (value: any): boolean => typeof value === 'function'
