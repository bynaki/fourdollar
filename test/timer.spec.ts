/**
 * test number
 */

import test from 'ava'
import {
  Timer
} from '../src/fourdollar'
import { setTimeout } from 'timers';


test.cb('Timer > Timer#start() && Timer#stop()', t => {
  const timer = new Timer(200, 100)
  let count = 0
  timer.iterate(() => {
    count++
    timer.stop()
  })
  // timer.start()
  setTimeout(() => {
    t.is(count, 1)
    t.false(timer.isStarted)
    timer.start()
  }, 300)
  setTimeout(() => {
    t.is(count, 2)
    t.false(timer.isStarted)
    t.end()
  }, 600)
})

test.cb('Timer > Timer#iterate() && Timer#remove()', t => {
  const timer = new Timer(200, 100)
  let count = 0
  let id01 = timer.iterate(val => {
    count += val
  }, 3)
  let id02 = timer.iterate(val => {
    count += val
  }, 7)
  let id03 = timer.iterate(val => {
    count += val
  }, 11)
  let id04 = timer.iterate(val => {
    count += val
    timer.stop()
    t.is(count, 27)
    t.end()
  }, 13)
  // timer.start()
  timer.remove(id02)
})

test.cb('Timer > 0.2초에 한번씩 실행 된다.', t => {
  const timer = new Timer(200)
  let count = 0
  timer.iterate((sDate: Date) => {
    let tt = new Date().getTime() - sDate.getTime()
    t.is(Math.floor(tt / 100), 2 * ++count)
    if(count === 3) {
      timer.stop()
      t.end()
    }
  }, new Date())
  // timer.start()
})

test.cb('Timer > 0.5초에 모든 work들이 한번씩 실행 된다.', t => {
  const timer = new Timer(500)
  timer.iterate((sDate: Date) => {
    let tt = (new Date().getTime() - sDate.getTime())
    t.is(Math.floor(tt / 100), 1)
  }, new Date())
  timer.iterate((sDate: Date) => {
    let tt = (new Date().getTime() - sDate.getTime())
    t.is(Math.floor(tt / 100), 2)
  }, new Date())
  timer.iterate((sDate: Date) => {
    let tt = (new Date().getTime() - sDate.getTime())
    t.is(Math.floor(tt / 100), 3)
  }, new Date())
  timer.iterate((sDate: Date) => {
    let tt = (new Date().getTime() - sDate.getTime())
    t.is(Math.floor(tt / 100), 4)
  }, new Date())
  timer.iterate((sDate: Date) => {
    let tt = (new Date().getTime() - sDate.getTime())
    t.is(Math.floor(tt / 100), 5)
    timer.stop()
    t.end()
  }, new Date())
  // timer.start()
})

test.cb('Timer > minTick', t => {
  const timer = new Timer(200, 100)
  timer.iterate((sDate: Date) => {
    let tt = new Date().getTime() - sDate.getTime()
    t.is(Math.floor(tt / 100), 1)
  }, new Date())
  timer.iterate((sDate: Date) => {
    let tt = new Date().getTime() - sDate.getTime()
    t.is(Math.floor(tt / 100), 2)
  }, new Date())
  timer.iterate((sDate: Date) => {
    let tt = new Date().getTime() - sDate.getTime()
    t.is(Math.floor(tt / 100), 3)
  }, new Date())
  timer.iterate((sDate: Date) => {
    let tt = new Date().getTime() - sDate.getTime()
    t.is(Math.floor(tt / 100), 4)
    timer.stop()
    t.end()
  }, new Date())
  // timer.start()
})

test('Timer > Timer#once()', async t => {
  async function work(echo: string): Promise<string> {
    return echo
  }
  const timer = new Timer(100)
  let echo = await timer.once(work, 'hello')
  t.is(echo, 'hello')
  timer.stop()
})

test('Timer > Timer#once() > 0.2초후 실행된다.', async t => {
  async function work(): Promise<number> {
    return new Date().getTime()
  }
  const timer = new Timer(200, 100)
  let sTime = new Date().getTime()
  let eTime = await timer.once(work)
  t.is(Math.floor((eTime - sTime) / 100), 2)
})

test('Timer > Timer#once() > once()와 iterate()가 벌갈아 실행된다.', async t => {
  let sTime = new Date().getTime()
  async function work(): Promise<number> {
    return new Date().getTime()
  }
  const timer = new Timer(200, 100)
  timer.iterate(() => {
    let eTime = new Date().getTime()
    t.is(Math.floor((eTime - sTime) / 100), 1)
  })
  timer.iterate(() => {
    let eTime = new Date().getTime()
    t.is(Math.floor((eTime - sTime) / 100), 3)
  })
  let eTime = await timer.once(async () => {
    return new Date().getTime()
  })
  t.is(Math.floor((eTime - sTime) / 100), 2)
  eTime = await timer.once(async () => {
    return new Date().getTime()
  })
  t.is(Math.floor((eTime - sTime) / 100), 4)
  timer.stop()
})