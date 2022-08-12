import Observable from 'zen-observable'
import test from 'ava'
import {
  DefaultWriter,
  getLogger,
  MemoryWriter,
  stop,
  Observable as MyObservable,
  types as I,
} from '../src'


test('zen-observable', t => {
  t.plan(7)
  const writer = new MemoryWriter(100)
  writer.link = new DefaultWriter()
  const log = getLogger(writer)
  let count = 0
  const subs: ZenObservable.SubscriptionObserver<string>[] = []
  const obs = new Observable<string>(sub => {
    log('initialize!')
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
      count++
      log(`returned!: sub.closed = ${sub.closed}`)
      const m = writer.memory
      if(count === 2) {
        t.is(m.length, 6)
        t.is(m[0], 'initialize!')
        t.is(m[1], 'initialize!')
        t.is(m[2], 'hello')
        t.is(m[3], 'complete!: sub.closed = true')
        t.is(m[4], 'returned!: sub.closed = true')
        t.is(m[5], 'returned!: sub.closed = true')
      }
    }
  })
  const sub = obs.subscribe({
    start(sub) {
      log('start!')
    },
    next(msg) {
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub.closed}`)
    }
  })
  return obs
})

test('myobservable', t => {
  t.plan(8)
  const writer = new MemoryWriter(100)
  writer.link = new DefaultWriter()
  const log = getLogger(writer)
  let count = 0
  const subs: I.SubscriptionObserver<string>[] = []
  const obs = new MyObservable<string>(sub => {
    log('initialize!')
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
      log(`returned!: sub.closed = ${sub.closed}`)
      const m = writer.memory
      if(++count === 2) {
        t.is(m.length, 7)
        t.is(m[0], 'initialize!')
        t.is(m[1], 'start!')
        t.is(m[2], 'initialize!')
        t.is(m[3], 'hello')
        t.is(m[4], 'complete!: sub.closed = true')
        t.is(m[5], 'returned!: sub.closed = true')
        t.is(m[6], 'returned!: sub.closed = true')
      }
    }
  })
  const sub = obs.subscribe({
    start(sub) {
      log('start!')
    },
    next(msg) {
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub.closed}`)
    }
  })
  return obs
})

test('zen-observable: unsubscribe', t => {
  t.plan(7)
  const writer = new MemoryWriter(100)
  writer.link = new DefaultWriter()
  const log = getLogger(writer)
  let count = 0
  let subs: ZenObservable.SubscriptionObserver<string>[] = []
  const obs = new Observable<string>(sub => {
    log('initialize!')
    subs.push(sub)
    return () => {
      log(`returned!: sub.closed = ${sub.closed}`)
      if(++count === 2) {
        const m = writer.memory
        t.is(m.length, 6)
        t.is(m[0], 'initialize!')
        t.is(m[1], 'initialize!')
        t.is(m[2], 'hello')
        t.is(m[3], 'returned!: sub.closed = true')
        t.is(m[4], 'subs.length = 1')
        t.is(m[3], 'returned!: sub.closed = true')
      }
    }
  })
  const id = setInterval(() => {
    subs = subs.map(sub => {
      sub.next('hello')
      return sub
    }).filter(sub => {
      return !sub.closed
    })
    log(`subs.length = ${subs.length}`)
    if(subs.length === 1) {
      subs[0].complete()
      clearInterval(id)
    }
  }, 1000)
  const sub = obs.subscribe({
    start(sub) {
      log('start!')
    },
    next(msg) {
      log(msg)
      sub.unsubscribe()
    },
    complete() {
      log(`complete!: sub.closed = ${sub.closed}`)
    }
  })
  return obs
})

test('mybservable: unsubscribe', t => {
  t.plan(8)
  const writer = new MemoryWriter(100)
  writer.link = new DefaultWriter()
  const log = getLogger(writer)
  let count = 0
  let subs: I.SubscriptionObserver<string>[] = []
  const obs = new MyObservable<string>(sub => {
    log('initialize!')
    subs.push(sub)
    return () => {
      log(`returned!: sub.closed = ${sub.closed}`)
      if(++count === 2) {
        const m = writer.memory
        t.is(m.length, 7)
        t.is(m[0], 'initialize!')
        t.is(m[1], 'start!')
        t.is(m[2], 'initialize!')
        t.is(m[3], 'hello')
        t.is(m[4], 'returned!: sub.closed = true')
        t.is(m[5], 'subs.length = 1')
        t.is(m[6], 'returned!: sub.closed = true')
      }
    }
  })
  const id = setInterval(() => {
    subs = subs.map(sub => {
      sub.next('hello')
      return sub
    }).filter(sub => {
      return !sub.closed
    })
    log(`subs.length = ${subs.length}`)
    if(subs.length === 1) {
      subs[0].complete()
      clearInterval(id)
    }
  }, 1000)
  const sub = obs.subscribe({
    start(sub) {
      log('start!')
    },
    next(msg) {
      log(msg)
      sub.unsubscribe()
    },
    complete() {
      log(`complete!: sub.closed = ${sub.closed}`)
    }
  })
  return obs
})

// promise 안됨
test('zen-observable: promise', t => {
  t.plan(10)
  const writer = new MemoryWriter(100)
  writer.link = new DefaultWriter()
  const log = getLogger(writer)
  let subs: ZenObservable.SubscriptionObserver<string>[] = []
  let c = 0
  const obs = new Observable<string>(sub => {
    log('initialize!')
    subs.push(sub)
    return () => {
      log(`returned!: sub.closed = ${sub.closed}`)
      if(++c === 3) {
        const m = writer.memory
        t.is(m.length, 9)
        t.is(m[0], 'initialize!')
        t.is(m[1], 'initialize!')
        t.is(m[2], 'initialize!')
        t.is(m[3], 'hello 1')
        t.is(m[4], 'complete!: sub.closed = true')
        t.is(m[5], 'returned!: sub.closed = true')
        t.is(m[6], 'complete!: sub.closed = true')
        t.is(m[7], 'returned!: sub.closed = true')
        t.is(m[8], 'returned!: sub.closed = true')
      }
    }
  })
  const sub1 = obs.subscribe({
    async next(msg) {
      await stop(300)
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub1.closed}`)
    }
  })
  const sub2 = obs.subscribe({
    async next(msg) {
      await stop(100)
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub2.closed}`)
    }
  })
  let count = 0
  const callback = async () => {
    count++
    await Promise.all(subs.map(sub => sub.next(`hello ${count}`)))
    subs = subs.filter(sub => !sub.closed)
    if(count == 3) {
      subs.forEach(sub => sub.complete())
    } else {
      setTimeout(callback, 70)
    }
  }
  callback()
  return obs
})

// promise 됨
test('myobservable: promise', t => {
  t.plan(15)
  const writer = new MemoryWriter(100)
  writer.link = new DefaultWriter()
  const log = getLogger(writer)
  let subs: I.SubscriptionObserver<string>[] = []
  let c = 0
  const obs = new MyObservable<string>(sub => {
    log('initialize!')
    subs.push(sub)
    return () => {
      log(`returned!: sub.closed = ${sub.closed}`)
      if(++c === 3) {
        const m = writer.memory
        t.is(m.length, 14)
        t.is(m[0], 'initialize!')
        t.is(m[1], 'initialize!')
        t.is(m[2], 'initialize!')
        t.is(m[3], 'hello 1')
        t.is(m[4], 'hello 1')
        t.is(m[5], 'hello 2')
        t.is(m[6], 'hello 2')
        t.is(m[7], 'hello 3')
        t.is(m[8], 'hello 3')
        t.is(m[9], 'complete!: sub.closed = true')
        t.is(m[10], 'returned!: sub.closed = true')
        t.is(m[11], 'complete!: sub.closed = true')
        t.is(m[12], 'returned!: sub.closed = true')
        t.is(m[13], 'returned!: sub.closed = true')
      }
    }
  })
  const sub1 = obs.subscribe({
    async next(msg) {
      await stop(300)
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub1.closed}`)
    }
  })
  const sub2 = obs.subscribe({
    async next(msg) {
      await stop(100)
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub2.closed}`)
    }
  })
  let count = 0
  const callback = async () => {
    count++
    await Promise.all(subs.map(sub => sub.next(`hello ${count}`)))
    subs = subs.filter(sub => !sub.closed)
    if(count == 3) {
      subs.forEach(sub => sub.complete())
    } else {
      setTimeout(callback, 70)
    }
  }
  callback()
  return obs
})

test('zen-observable: ', t => {
  t.plan(10)
  const writer = new MemoryWriter(100)
  writer.link = new DefaultWriter()
  const log = getLogger(writer)
  let subs: ZenObservable.SubscriptionObserver<string>[] = []
  let c = 0
  const obs = new Observable<string>(sub => {
    log('initialize!')
    subs.push(sub)
    return () => {
      log(`returned!: sub.closed = ${sub.closed}`)
      if(++c === 3) {
        const m = writer.memory
        t.is(m.length, 9)
        t.is(m[0], 'initialize!')
        t.is(m[1], 'initialize!')
        t.is(m[2], 'initialize!')
        t.is(m[3], 'hello 1')
        t.is(m[4], 'complete!: sub.closed = true')
        t.is(m[5], 'returned!: sub.closed = true')
        t.is(m[6], 'complete!: sub.closed = true')
        t.is(m[7], 'returned!: sub.closed = true')
        t.is(m[8], 'returned!: sub.closed = true')
      }
    }
  })
  const sub1 = obs.subscribe({
    async next(msg) {
      await stop(300)
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub1.closed}`)
    }
  })
  const sub2 = obs.subscribe({
    async next(msg) {
      await stop(100)
      log(msg)
    },
    complete() {
      log(`complete!: sub.closed = ${sub2.closed}`)
    }
  })
  let count = 0
  const callback = async () => {
    count++
    await Promise.all(subs.map(sub => sub.next(`hello ${count}`)))
    subs = subs.filter(sub => !sub.closed)
    if(count == 3) {
      subs.forEach(sub => sub.complete())
    } else {
      setTimeout(callback, 70)
    }
  }
  callback()
  return obs
})


test('zen-observable: return <Subscription>', t => {
  t.plan(1)
  const obs = new Observable<string>(sub => {
    return {
      closed: false,
      unsubscribe() {
        t.pass()
      },
    }
  })
  const sub = obs.subscribe({
    next(value: string) {
      console.log(`next: ${value}`)
    },
  })
  sub.unsubscribe()
})

test('myobservable: return <Subscription>', t => {
  t.plan(1)
  const obs = new MyObservable<string>(o => {
    return {
      closed: false,
      unsubscribe() {
        t.pass()
      },
    }
  })
  const sub = obs.subscribe({
    next(value: string) {
      console.log(`next: ${value}`)
    },
  })
  sub.unsubscribe()
})

test('myobservable: start', t => {
  t.plan(2)
  const obs = new MyObservable<string>(o => {
    return () => {
      t.pass()
    }
  })
  const sub = obs.subscribe({
    start(sub: I.Subscription) {
      t.pass()
      sub.unsubscribe()
    }
  })
})

test('myobservable: extends', t => {
  t.plan(3)
  let so: I.SubscriptionObserver<string>
  const obs = new MyObservable<string>(o => {
    so = o
  })
  const sub = {
    count: 0,
    value: 'world',
    start(s: I.Subscription) {
      sub.count = 1
      t.is(sub.value, 'world')
    },
    next(value: string) {
      console.log('next')
      sub.value = value
      ++sub.count
    },
    complete() {
      console.log('complete')
      t.is(sub.value, 'hello')
      t.is(sub.count, 4)
    },
  }
  obs.subscribe(sub)
  so!.next('hello')
  so!.next('hello')
  so!.next('hello')
  so!.complete()
})
