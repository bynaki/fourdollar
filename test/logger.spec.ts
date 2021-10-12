/**
 * test logger
 */

import test from 'ava'
import {
  Logger,
  FileWriter,
  stop,
} from '../src'
import {
  readFile,
  remove,
} from 'fs-extra'
import {
  join,
} from 'path'



{
  const logger = new Logger('Hello')

  test.serial('Logger > Logger#log()', t => {
    const origin = Logger.writer.log
    const orginFormat = Logger.format
    Logger.format = ':name: < :time:\n:msg:'
    Logger.writer.log = (msg) => {
      console.log(msg)
      const reg = /Hello < \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\nfoo\nbar/
      t.regex(msg, reg)
    }
    logger.log('foo', 'bar')
    Logger.writer.log = origin
    Logger.format = orginFormat
  })

  test.serial('Logger > Logger#error()', t => {
    const origin = Logger.writer.error
    const orginFormat = Logger.format
    Logger.format = ':name: < :time:\n:msg:'
    Logger.writer.error = (msg) => {
      console.log(msg)
      const reg = /Hello < \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\nfoo\nbar/
      t.regex(msg, reg)
    }
    logger.error('foo', 'bar')
    Logger.writer.error = origin
    Logger.format = orginFormat
  })

  test.serial('Logger > Logger.format: default', t => {
    const origin = Logger.writer.log
    Logger.writer.log = (msg) => {
      console.log(msg)
      t.regex(msg, /\d{4}-\d\d-\d\d \d\d:\d\d:\d\d.\d{3} > Hello - foobar/)
    }
    logger.log('foobar')
    Logger.writer.log = origin
  })

  test.serial('Logger > Logger.format = ":time: > [:name:] :msg:"', t => {
    const origin = Logger.writer.log
    const formatOri = Logger.format
    Logger.format = ':time: > [:name:] :msg:'
    Logger.writer.log = (msg) => {
      console.log(msg)
      t.regex(msg, /\d{4}-\d\d-\d\d \d\d:\d\d:\d\d.\d{3} > \[Hello\] foobar/)
    }
    logger.log('foobar')
    Logger.format = formatOri
    Logger.writer.log = origin
  })
}

{
  const logger = new Logger('Log Json')
  test.serial('Logger > Logger#log(): Log Json', t => {
    const origin = Logger.writer.log
    const orginFormat = Logger.format
    Logger.format = ':name: < :time:\n:msg:'
    Logger.writer.log = (msg) => {
      console.log(msg)
      const reg = /Log Json < \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\n{\n  "foo": "bar",\n  "hello": "world"\n}/
      t.regex(msg, reg)
    }
    logger.log({
      foo: 'bar',
      hello: 'world',
    })
    Logger.writer.log = origin
    Logger.format = orginFormat
  })
}

{
  class TestError extends Error {
    constructor(msg?: string) {
      super(msg)
    }
    
    get name() {
      return 'TestError'
    }
  }
  const logger = new Logger('Log Error')
  test.serial('Logger > Logger#log(): Log Error', t => {
    const e = new TestError('this is error!!')
    logger.error(e)
    t.pass()
  })
}

{
  const logger = new Logger('World')
  const dir = join(__dirname, 'log')
  const file = 'normal.log'
  
  test.serial.after(() => remove(dir))
  
  test.serial('Logger > StreamLogger#log(): normal stream', async t => {
    Logger.writer.link = new FileWriter(join(dir, file))
    logger.log('foobar')
    await stop(500)
    let content = await readFile(join(dir, file))
    const reg = /log: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} > World - foobar/
    t.regex(content.toString(), reg)
    Logger.writer.link = null
  })

  test.serial('Logger > StreamLogger#error(): normal stream', async t => {
    Logger.writer.link = new FileWriter(join(dir, file))
    logger.error('foobar')
    await stop(500)
    let content = await readFile(join(dir, file))
    const reg = /err: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} > World - foobar/
    t.regex(content.toString(), reg)
    Logger.writer.link = null
  })
}

{
  const logger = new Logger('Sap')
  const dir = join(__dirname, 'log')
  const file = 'rotating.log'
  
  test.serial('Logger > StreamLogger#log(): rotating stream', async t => {
    const origin = Logger.writer
    Logger.writer = new FileWriter(join(dir, file), '1d')
    logger.log('foobar')
    await stop(500)
    let content = await readFile(join(dir, file))
    const reg = /log: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} > Sap - foobar/
    t.regex(content.toString(), reg)
    Logger.writer = origin
  })
  
  test.serial('Logger > StreamLogger#error(): rotating stream', async t => {
    const origin = Logger.writer
    Logger.writer = new FileWriter(join(dir, file), '1d')
    logger.error('foobar')
    await stop(500)
    let content = await readFile(join(dir, file))
    const reg = /err: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} > Sap - foobar/
    t.regex(content.toString(), reg)
    Logger.writer = origin
  })
}


class Hello extends Logger {
  constructor(public readonly code: string) {
    super()
  }

  get name() {
    return `${this.constructor.name}:${this.code}`
  }
}

{
  const logger = new Hello('World')

  test.serial('Logger > extends', t => {
    const origin = Logger.writer.log
    Logger.writer.log = (msg) => {
      console.log(msg)
      t.regex(msg, /\d{4}-\d\d-\d\d \d\d:\d\d:\d\d.\d{3} > Hello:World - foobar/)
    }
    logger.log('foobar')
    Logger.writer.log = origin
  })
}
