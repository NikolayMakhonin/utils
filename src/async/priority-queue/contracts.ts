export type PromiseOrValue<T> = T | Promise<T>

export type TCompare<T> = (o1: T, o2: T) => number
