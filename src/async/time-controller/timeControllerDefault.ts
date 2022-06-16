import {ITimeController} from './contracts'

export const timeControllerDefault: ITimeController = {
  now: function now() {
    return Date.now()
  },
  setTimeout: typeof window === 'undefined'
    ? setTimeout
    : function setTimeout() {
      return setTimeout.apply(window, arguments)
    },
  clearTimeout: typeof window === 'undefined'
    ? clearTimeout
    : function clearTimeout() {
      return clearTimeout.apply(window, arguments)
    },
}