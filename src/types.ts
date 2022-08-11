
export interface SubscriptionObserver<T> {
  closed: boolean
  // start(subscription: Subscription)
  next(value: T): Promise<void> | void
  error(err: any): void
  complete(): void
}

export interface Subscription {
  closed: boolean
  unsubscribe(): void
}

export interface Observer<T> {
  [property: string]: any
  start?(subscription: Subscription): any
  next?(value: T): Promise<void> | void
  error?(err: any): void
  complete?(): void
}

export type Subscriber<T> = (observer: SubscriptionObserver<T>) => void | (() => void) | Subscription