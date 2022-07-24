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
  MemoryWriter,
  getLogger,
} from '../src'
import {
  join,
} from 'path'
import { IWriter } from '../src/Logger'




{
  const dir = join('./log')
  removeSync(dir)

  const twin = new DefaultWriter()
  twin.link = new FileWriter(join(dir, 'twin.log'))

  const memory = new MemoryWriter


  class TestLog {
    constructor() {}

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

    @logger(memory)
    memoryLog(msg) {
      return msg
    }
  }



  const tlog = new TestLog()

  test('logger v2 > default log', t => {
    t.plan(2)
    const writer: DefaultWriter = (tlog.log as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'Hello World!')
      return ori(msg)
    }
    const l = tlog.log('Hello World!')
    t.is(l, 'Hello World!')
    writer.write = ori
  })

  test('logger v2 > DefaultWriter', t => {
    t.plan(2)
    const writer: DefaultWriter = (tlog.defaultLog as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'Hello World!')
      return ori(msg)
    }
    const l = tlog.defaultLog('Hello World!')
    t.is(l, 'Hello World!')
    writer.write = ori
  })

  test('logger v2 > stream log: normal', async t => {
    const res1 = tlog.streamLog('foobar')
    await stop(500)
    const res2 = await readFile(join(dir, 'normal.log'))
    t.is('foobar', res1)
    t.is('\nfoobar', res2.toString())
  })

  test('logger v2 > stream log: rotating', async t => {
    const res1 = tlog.rotatLog('hello')
    await stop(500)
    const res2 = await readFile(join(dir, 'rotating.log'))
    t.is('hello', res1)
    t.is('\nhello', res2.toString())
  })

  test('logger v2 > overload log', async t => {
    const res1 = tlog.overloadLog('overload')
    await stop(500)
    const res2 = await readFile(join(dir, 'overload.log'))
    t.is('overload', res1)
    t.is('\noverload', res2.toString())
  })

  test('logger v2 > twin writer', async t => {
    t.plan(3)
    const writer: DefaultWriter = (tlog.twinLog as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'naki')
      return ori(msg)
    }
    const res1 = tlog.twinLog('naki')
    await stop(500)
    const res2 = await readFile(join(dir, 'twin.log'))
    t.is(res1, 'naki')
    t.is(res2.toString(), '\nnaki')
    writer.write = ori
  })

  test('logger v2 > error log', async t => {
    t.plan(3)
    const writer: DefaultWriter = (tlog.log as any).writer
    const ori = writer.write
    const err = new Error('error!!')
    writer.write = msg => {
      t.is(typeof(msg), 'string')
      t.deepEqual(JSON.parse(msg), {
        name: err.name,
        message: err.message,
        stack: err.stack,
      })
      return ori(msg)
    }
    const res = tlog.log(err)
    t.is(res, err)
    writer.write = ori
  })

  test('logger v2 > json log', async t => {
    t.plan(3)
    const writer: DefaultWriter = (tlog.log as any).writer
    const ori = writer.write
    const json = {
      name: 'naki',
      sex: 'man',
      age: 10,
    }
    writer.write = msg => {
      t.is(typeof(msg), 'string')
      t.deepEqual(JSON.parse(msg), json)
      return ori(msg)
    }
    const res = tlog.log(json)
    t.deepEqual(res, json)
    writer.write = ori
  })

  test('logger v2 > if msg is null', t => {
    t.plan(2)
    const writer: DefaultWriter = (tlog.log as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'null')
    }
    const l = tlog.log(null)
    t.is(l, null)
    writer.write = ori
  })

  test('logger v2 > if msg is undefined', t => {
    t.plan(2)
    const writer: DefaultWriter = (tlog.log as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'undefined')
    }
    const l = tlog.log(undefined)
    t.is(l, undefined)
    writer.write = ori
  })

  test('logger v2 > number', t => {
    t.plan(2)
    const writer: DefaultWriter = (tlog.log as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, '1234')
    }
    const l = tlog.log(1234)
    t.is(l, 1234)
    writer.write = ori
  })

  test('logger v2 > boolean', t => {
    t.plan(2)
    const writer: DefaultWriter = (tlog.log as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'false')
    }
    const l = tlog.log(false)
    t.false(l)
    writer.write = ori
  })



  class ChildLog extends TestLog {
    constructor() {
      super()
    }

    getWriter(): IWriter {
      return (super.log as any).writer
    }

    log(msg) {
      return super.log(msg + ', second msg')
    }
  }

  test('logger v2 > inherit', async t => {
    t.plan(1)
    const clog = new ChildLog()
    const writer = clog.getWriter()
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'first msg, second msg')
    }
    clog.log('first msg')
    writer.write = ori
  })

  test('logger v2 > memory log', async t => {
    tlog.memoryLog('hello')
    tlog.memoryLog(123)
    tlog.memoryLog(true)
    tlog.memoryLog([1, 2, 3])
    tlog.memoryLog({
      foo: 'bar',
      num: 123,
    })
    tlog.memoryLog('last')
    for(let i of memory.memory) {
      console.log(i)
    }
    const m = memory.memory
    t.is(m.length, 6)
    t.is(m[0], 'hello')
    t.is(m[1], '123')
    t.is(m[2], 'true')
    t.is(m[3], '[\n  1,\n  2,\n  3\n]')
    t.is(m[4], '{\n  "foo": "bar",\n  "num": 123\n}')
    t.is(m[5], 'last')
  })
}

test('logger v2 > getLogger()', t => {
  t.plan(1)
  const log = getLogger()
  const writer: IWriter = log['writer']
  writer.write = msg => {
    t.is(msg, 'hello world!')
  }
  log('hello world!')
})
