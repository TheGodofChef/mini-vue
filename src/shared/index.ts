export const extend = Object.assign

export const EMPTY_OBJ = {}

export const isObject = (val: any) => val !== null && typeof val === 'object'

export const hasChanged = (value, newVal) => {
  return !Object.is(value, newVal)
}

export const camelize = (str: string) =>  {
  return str.replace(/-(\w)/g, (_, c) => {
      return c ? c.toUpperCase() : ''
  })
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : ''
}