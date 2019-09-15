/**
 * test stop
 */

import test from 'ava'
import {
  stop,
} from '../src/stop'
import $4 from '../src/fourdollar'



test('stop > stop()', async t => {
  const t1 = Date.now()
  await stop(1000)
  const t2 = Date.now()
  t.is(Math.floor((t2 - t1) / 1000), 1)
})

test('stop > $4', async t => {
  const t1 = Date.now()
  await $4.stop(100)
  const t2 = Date.now()
  t.is(Math.floor((t2 - t1) / 100), 1)
})