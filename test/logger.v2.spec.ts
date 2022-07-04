import test from 'ava'
import {
  removeSync,
  readFile,
} from 'fs-extra'
import {
  DefaultWriter,
  FileWriter,
  logger,
  stop,
} from '../src'
import {
  join,
} from 'path'




{
  const dir = join('./log')
  removeSync(dir)

  const twin = new DefaultWriter()
  twin.link = new FileWriter(join(dir, 'twin.log'))


  class TestLog {
    @logger()
    log(msg) {
      return msg
    }

    @logger(new DefaultWriter())
    defaultLog(msg) {
      return msg
    }

    @logger(new FileWriter(join(dir, 'normal.log')))
    streamLog(msg) {
      return msg
    }

    @logger(new FileWriter(join(dir, 'rotating.log'), '1d'))
    rotatLog(msg) {
      return msg
    }

    @logger(join(dir, 'overload.log'))
    overloadLog(msg) {
      return msg
    }

    @logger(twin)
    twinLog(msg) {
      return msg
    }
  }


  const tlog = new TestLog()

  test('logger v2 > default log', t => {
    const l = tlog.log('Hello World!')
    t.is(l, 'Hello World!')
  })

  test('logger v2 > DefaultWriter', t => {
    const l = tlog.defaultLog('Hello World!')
    t.is(l, 'Hello World!')
  })

  test('logger v2 > stream log: normal', async t => {
    const res1 = tlog.streamLog('foobar')
    await stop(500)
    const res2 = await readFile(join(dir, 'normal.log'))
    t.is('\n' + res1, res2.toString())
  })

  test('logger v2 > stream log: rotating', async t => {
    const res1 = tlog.rotatLog('hello')
    await stop(500)
    const res2 = await readFile(join(dir, 'rotating.log'))
    t.is('\n' + res1, res2.toString())
  })

  test('logger v2 > overload log', async t => {
    const res1 = tlog.overloadLog('overload')
    await stop(500)
    const res2 = await readFile(join(dir, 'overload.log'))
    t.is('\n' + res1, res2.toString())
  })

  test('logger v2 > twin writer', async t => {
    const res1 = tlog.twinLog('naki')
    await stop(500)
    const res2 = await readFile(join(dir, 'twin.log'))
    t.is('\n' + res1, res2.toString())
  })

  test('logger v2 > error log', async t => {
    const err = new Error('error!!')
    const res = tlog.log(err)
    t.deepEqual(JSON.parse(res), {
      name: err.name,
      message: err.message,
      stack: err.stack,
    })
  })

  test('logger v2 > json log', async t => {
    const json = {
      name: 'naki',
      sex: 'man',
      age: 10,
    }
    const res = tlog.log(json)
    t.deepEqual(json, JSON.parse(res))
  })
}
