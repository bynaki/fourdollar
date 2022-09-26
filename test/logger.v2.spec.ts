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
import fecha from 'fecha'




{
  const dir = join('./log')
  removeSync(dir)

  const tree = new DefaultWriter()
  const fw = new FileWriter(join(dir, 'tree.log'))
  const mw = new MemoryWriter()
  tree.link = fw
  fw.link = mw


  const memory = new MemoryWriter


  class TestLog {
    myName: string

    constructor() {
      this.myName = this.constructor.name
    }

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
    overloadLog(msg: any) {
      const myMask = 'YYYY-MM-DD HH:mm:ss.SSS'
      return {
        name: this.constructor.name,
        time: fecha.format(new Date(), myMask),
        message: msg,
      }
    }

    @logger(tree)
    treeLog(msg) {
      return msg
    }

    @logger(memory)
    memoryLog(msg) {
      return msg
    }

    @logger(join(dir, 'type.log'))
    typeLog(msg: any) {
      return msg
    }

    @logger(memory)
    thisLog(msg: string) {
      return this.myName + `::${msg}`
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
    const err = new Error('error')
    const msgList = [
      'foobar',
      1234,
      true,
      undefined,
      null,
      NaN,
      [1, 2, 3, 4],
      {
        foo: 'bar',
        hello: 'world',
      },
      err,
    ]
    msgList.forEach(msg => tlog.streamLog(msg))
    const res1 = `\n${msgList.map(msg => {
      if(msg === undefined) {
        return 'undefined'
      }
      if(msg instanceof Error) {
        return JSON.stringify({
          name: msg.name,
          message: msg.message,
          stack: msg.stack,
        }, null, 2)
      }
      return JSON.stringify(msg, null, 2)
    }).join('\n')}`
    console.log(res1)
    await stop(500)
    const res2 = await readFile(join(dir, 'normal.log'))
    t.is(res2.toString(), res1)
  })

  test('logger v2 > stream log: rotating', async t => {
    const err = new Error('error')
    const msgList = [
      'foobar',
      1234,
      true,
      undefined,
      null,
      NaN,
      [1, 2, 3, 4],
      {
        foo: 'bar',
        hello: 'world',
      },
      err,
    ]
    msgList.forEach(msg => tlog.rotatLog(msg))
    const res1 = `\n${msgList.map(msg => {
      if(msg === undefined) {
        return 'undefined'
      }
      if(msg instanceof Error) {
        return JSON.stringify({
          name: msg.name,
          message: msg.message,
          stack: msg.stack,
        }, null, 2)
      }
      return JSON.stringify(msg, null, 2)
    }).join('\n')}`
    console.log(res1)
    await stop(500)
    const res2 = await readFile(join(dir, 'rotating.log'))
    t.is(res2.toString(), res1)
  })

  test('logger v2 > overload log', async t => {
    const res1 = tlog.overloadLog('overload')
    await stop(500)
    const res2 = await readFile(join(dir, 'overload.log'))
    t.deepEqual(Object.keys(res1), ['name', 'time', 'message'])
    t.is(res2.toString(), `\n${JSON.stringify(res1, null, 2)}`)
  })

  test('logger v2 > tree writer', async t => {
    t.plan(5)
    const writer: DefaultWriter = (tlog.treeLog as any).writer
    const ori = writer.write
    writer.write = msg => {
      t.is(msg, 'naki')
      return ori(msg)
    }
    const res1 = tlog.treeLog('naki')
    await stop(500)
    const res2 = await readFile(join(dir, 'tree.log'))
    t.is(res1, 'naki')
    t.is(res2.toString(), '\n"naki"')
    t.is(mw.memory.length, 1)
    t.is(mw.memory[0], 'naki')
    writer.write = ori
  })

  test.serial('logger v2 > error log', async t => {
    memory.clear()
    const err = new Error('error!!')
    tlog.memoryLog(err)
    t.deepEqual(memory.memory[0], {
      name: err.name,
      message: err.message,
      stack: err.stack,
    })
  })

  test('logger v2 > varied types log', async t => {
    const err = new Error('error')
    const msgList = [
      'foobar',
      1234,
      true,
      undefined,
      null,
      NaN,
      [1, 2, 3, 4],
      {
        foo: 'bar',
        hello: 'world',
      },
      err,
    ]
    msgList.forEach(msg => tlog.typeLog(msg))
    const right = [
      '"foobar"',
      '1234',
      'true',
      'undefined',
      'null',
      'null',
      JSON.stringify([1, 2, 3, 4], null, 2),
      JSON.stringify({
        foo: 'bar',
        hello: 'world',
      }, null, 2),
      JSON.stringify({
        name: err.name,
        message: err.message,
        stack: err.stack,
      }, null, 2)
    ]
    await stop(500)
    const res = (await readFile(join(dir, 'type.log'))).toString()
    t.is(res, `\n${right.join('\n')}`)
  })

  test.serial('logger v2 > this', async t => {
    memory.clear()
    tlog.thisLog('hello')
    t.is(memory.memory[0], 'TestLog::hello')
  })

  class ChildLog extends TestLog {
    constructor() {
      super()
    }

    getWriter(): IWriter {
      return (super.log as any).writer
    }

    thisLog(msg) {
      return super.thisLog(`${msg}~~`)
    }
  }

  test.serial('logger v2 > inherit', async t => {
    memory.clear()
    const child = new ChildLog()
    child.thisLog('world')
    t.is(memory.memory[0], 'ChildLog::world~~')
  })

  test.serial('logger v2 > memory log', async t => {
    memory.clear()
    tlog.memoryLog('hello')
    tlog.memoryLog(123)
    tlog.memoryLog(true)
    tlog.memoryLog(undefined)
    tlog.memoryLog(null)
    tlog.memoryLog(NaN)
    tlog.memoryLog([1, 2, 3])
    tlog.memoryLog({
      foo: 'bar',
      num: 123,
    })
    tlog.memoryLog('last')
    const m = memory.memory
    t.is(m.length, 9)
    t.deepEqual(m, [
      'hello',
      123,
      true,
      undefined,
      null,
      NaN,
      [1, 2, 3],
      {foo: 'bar', num: 123},
      'last',
    ])
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
