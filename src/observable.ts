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
  abstract subscribe(observer: ZenObservable.Observer<T>): ZenObservable.Subscription
  abstract subscribe(
    onNext: (value: T) => void,
    onError?: (error: any) => void,
    onComplete?: () => void,
  ): ZenObservable.Subscription

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
    let subObs: SubscriptionObserver<T>
    let cp: () => void
    if(args[0].complete) {
      cp = args[0].complete
    } else if(args[2]) {
      cp = args[2]
    } else {
      cp = () => {}
    }
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
              // todo
              // returned
            }
          }
        }
      }
    }
    if(typeof(args[0]) === 'function') {
      subObs = {
        closed: false,
        next: args[0],
        error: args[1]? args[1] : (err: any) => {},
        complete: makeComplete(cp),
      }
    } else {
      subObs = {
        closed: false,
        next: args[0].next? args[0].next : (value: T) => {},
        error: args[0].error? args[0].error : (err: any) => {},
        complete: makeComplete(cp)
      }
    }
    const returned = this.subscriber(subObs)
    const sub: Subscription = {
      closed: false,
      unsubscribe: makeComplete(() => {}),
    }
    return sub
  }
}
