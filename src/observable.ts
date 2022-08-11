/**
 * Observable
 * reference: https://github.com/zenparsing/zen-observable
 */

import {
  Observer,
  Subscription,
  SubscriptionObserver,
  Subscriber,
} from './types'



abstract class BaseObservable<T> {
  abstract subscribe(observer: Observer<T>): Subscription
  abstract subscribe(
    onNext: (value: T) => void,
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): Subscription

  // abstract [Symbol.observable](): Observable<T>

  // abstract forEach(callback: (value: T) => void): Promise<void>
  // abstract map<R>(callback: (value: T) => R): Observable<R>
  // abstract filter<S extends T>(callback: (value: T) => value is S): Observable<S>
  // abstract filter(callback: (value: T) => boolean): Observable<T>
  // abstract reduce(callback: (previousValue: T, currentValue: T) => T, initialValue?: T): Observable<T>
  // abstract reduce<R>(callback: (previousValue: R, currentValue: T) => R, initialValue?: R): Observable<R>
  // abstract flatMap<R>(callback: (value: T) => ZenObservable.ObservableLike<R>): Observable<R>
  // abstract concat<R>(...observable: Array<Observable<R>>): Observable<R>

  // static from<R>(observable: Observable<R> | ZenObservable.ObservableLike<R> | ArrayLike<R>): Observable<R>
  // static of<R>(...items: R[]): Observable<R>
}


// todo: start
export class Observable<T> extends BaseObservable<T> {
  constructor(private readonly subscriber: Subscriber<T>) {
    super()
  }

  subscribe(observer: Observer<T>): Subscription
  subscribe(
    onNext: (value: T) => Promise<void> | void,
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): Subscription
  subscribe(...args): Subscription {
    const makeComplete = (cp: () => void) => {
      return () => {
        if(subObs.closed === false) {
          subObs.next = () => {}
          sub.closed = true
          subObs.closed = true
          cp()
          switch(typeof(returned)) {
            case 'undefined': {
              break
            }
            case 'function': {
              returned()
              break
            }
            default: {
            }
          }
        }
      }
    }
    let start: (subscription: Subscription) => any
    let next: (value: T) => Promise<void> | void
    let error: (err: any) => void
    let complete: () => void
    if(typeof(args[0]) === 'object') {
      start = args[0].start? args[0].start.bind(args[0]) : (sub: Subscription) => {}
      next = args[0].next? args[0].next.bind(args[0]) : (value: T) => {}
      error = args[0].error? args[0].error.bind(args[0]) : (err: any) => {}
      complete = makeComplete(args[0].complete? args[0].complete.bind(args[0]) : () => {})
    } else {
      start = (sub: Subscription) => {}
      next = args[0]
      error = args[1]? args[1] : (err: any) => {}
      complete = makeComplete(args[2]? args[2] : () => {})
    }
    const subObs: SubscriptionObserver<T> = {
      closed: false,
      next,
      error,
      complete,
    }
    const returned = this.subscriber(subObs)
    let sub: Subscription
    if(typeof(returned) === 'object') {
      sub = returned
    } else {
      sub = {
        closed: false,
        unsubscribe: makeComplete(() => {}),
      }
    }
    start(sub)
    return sub
  }
}
