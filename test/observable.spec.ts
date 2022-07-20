import Observable from 'zen-observable'
import test from 'ava'



interface SubscriptionObserver<T> {
  closed: boolean
  next(value: T): Promise<void> | void
  error(err: any): void
  complete(): void
}

interface Subscription {
  closed: boolean
  unsubscribe(): void
}

interface Observer<T> {
  start?(subscription: Subscription): any
  next?(value: T): Promise<void> | void
  error?(err: any): void
  complete?(): void
}



type Subscriber<T> = (observer: SubscriptionObserver<T>) => void | (() => void)/* | Subscription */



abstract class BaseObservable<T> {
  // constructor(subscriber: ZenObservable.Subscriber<T>);

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

class MyObservable<T> extends BaseObservable<T> {
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
    const complete = () => {
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
    if(typeof(args[0]) === 'function') {
      subObs = {
        closed: false,
        next: args[0],
        error: args[1]? args[1] : (err: any) => {},
        complete,
      }
    } else {
      subObs = {
        closed: false,
        next: args[0].next? args[0].next : (value: T) => {},
        error: args[0].error? args[0].error : (err: any) => {},
        complete,
      }
    }
    const returned = this.subscriber(subObs)
    const sub: Subscription = {
      closed: false,
      unsubscribe: complete,
    }
    return sub
  }
}




test.serial('zen-observable', t => {
  const subs: ZenObservable.SubscriptionObserver<string>[] = []
  const obs = new Observable<string>(sub => {
    console.log('initialize!')
    subs.push(sub)
    setTimeout(() => {
      subs.map(sub => {
        sub.next('hello')
        return sub
      }).forEach(sub => {
        sub.complete()
      })
    }, 100)
    return () => {
      console.log(`returned!: sub.closed = ${sub.closed}`)
      t.pass()
    }
  })
  const sub = obs.subscribe({
    start(sub) {
      console.log('start!')
    },
    next(msg) {
      console.log(msg)
    },
    complete() {
      console.log(`complete!: sub.closed = ${sub.closed}`)
    }
  })
  return obs
})

test.serial('myobservable', t => {
  const subs: ZenObservable.SubscriptionObserver<string>[] = []
  const obs = new MyObservable<string>(sub => {
    console.log('initialize!')
    subs.push(sub)
    setTimeout(() => {
      subs.map(sub => {
        sub.next('hello')
        return sub
      }).forEach(sub => {
        sub.complete()
      })
    }, 100)
    return () => {
      console.log(`returned!: sub.closed = ${sub.closed}`)
      t.pass()
    }
  })
  const sub = obs.subscribe({
    start(sub) {
      console.log('start!')
    },
    next(msg) {
      console.log(msg)
    },
    complete() {
      console.log(`complete!: sub.closed = ${sub.closed}`)
    }
  })
  return obs
})

test.serial('zen-observable: unsubscribe', t => {
  let subs: ZenObservable.SubscriptionObserver<string>[] = []
  const obs = new Observable<string>(sub => {
    console.log('initialize!')
    subs.push(sub)
    const id = setInterval(() => {
      subs = subs.map(sub => {
        sub.next('hello')
        return sub
      }).filter(sub => {
        return !sub.closed
      })
      console.log(`subs.length = ${subs.length}`)
      t.is(subs.length, 1)
      if(subs.length === 1) {
        subs[0].complete()
        clearInterval(id)
      }
    }, 1000)
    return () => {
      console.log(`returned!: sub.closed = ${sub.closed}`)
      t.pass()
    }
  })
  const sub = obs.subscribe({
    start(sub) {
      console.log('start!')
    },
    next(msg) {
      console.log(msg)
      sub.unsubscribe()
    },
    complete() {
      console.log(`complete!: sub.closed = ${sub.closed}`)
    }
  })
  return obs
})
