/**
 * test logger
 */

import test from 'ava'
import {
  Logger,
  FileWriter,
} from '../src/fourdollar'
import * as $4 from '../src/fourdollar'
import {
  readFile,
  remove,
} from 'fs-extra'
import {
  join,
} from 'path'
import * as stop from 'stop.js'

{
  const logger = new Logger('Hello')

  test.serial('Logger > Logger#log()', t => {
    const origin = Logger.writer.log
    Logger.writer.log = (msg) => {
      const reg = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} > Hello - foo bar/
      t.regex(msg, reg)
    }
    logger.log('foo', 'bar')
    Logger.writer.log = origin
  })

  test.serial('Logger > Logger#error()', t => {
    const origin = Logger.writer.error
    Logger.writer.error = (msg) => {
      const reg = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} > Hello - foo bar/
      t.regex(msg, reg)
    }
    logger.error('foo', 'bar')
    Logger.writer.error = origin
  })

  test.serial('Logger > Logger.format: default', t => {
    const origin = Logger.writer.log
    Logger.writer.log = (msg) => {
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
      t.regex(msg, /\d{4}-\d\d-\d\d \d\d:\d\d:\d\d.\d{3} > \[Hello\] foobar/)
    }
    logger.log('foobar')
    Logger.format = formatOri
    Logger.writer.log = origin
  })
}

{
  const logger = new Logger('World')
  const dir = join(__dirname, 'log')
  const file = 'normal.log'
  
  test.after.serial(() => remove(dir))
  
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