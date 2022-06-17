export function equals(v1, v2) {
  return v1 === v2
    // is NaN
    // eslint-disable-next-line no-self-compare
    || v1 !== v1 && v2 !== v2
}

export function isIterable(value: any): boolean {
  return value != null
    && typeof value === 'object'
    && (
      Array.isArray(value)
      || !(value instanceof String)
      && typeof value[Symbol.iterator] === 'function'
    )
}

export function isIterator(value: any): boolean {
  return isIterable(value)
    && typeof value.next === 'function'
}
