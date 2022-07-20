
interface SubScriptionObserver<T> {
  closed: boolean
  next(value: T): Promise<void>
  error(err: any): Promise<void>
  complete(): Promise<void>
}

interface Subscription {
  closed: boolean
  unsubscribe(): void
}

interface Observer<T> {
  next?(value: T): Promise<void>
  error?(err: any): Promise<void>
  complete?(): Promise<void>
}



type Subscriber<T> = (observer: SubScriptionObserver<T>) => void | (() => void)



class MyObservable<T> {
  constructor(private readonly subscriber: Subscriber<T>) {
  }

  subscribe(observer: Observer<T>): Subscription {
    const subObs: SubScriptionObserver<T> = {
      closed: false,
      next: observer.next? observer.next : async (value: T) => {},
      complete: observer.complete? observer.complete : async () => {},
      error: observer.error? observer.error : async (err: any) => {},
    }
    const returned = this.subscriber(subObs)
    const sub: Subscription = {
      closed: false,
      unsubscribe() {
        sub.closed = true
        subObs.closed = true
        subObs.next = async (value: T) => {}
        subObs.complete = async () => {}
      },
    }
    return sub
  }
}