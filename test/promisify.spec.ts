/**
 * test promisify
 */

import test from 'ava'
import $4 from '../src'


const obj = {
  name: 'bynaki',
  greet(err: Error, say: string, callback: Function): void {
    callback.apply(this, [err, `${say}, ${this.name}`])
  },
  _greet: null,
}

class TestObj {
  // _callback: (err: Error, greet: string) => void = null
  _greet: (err: Error, say: string) => Promise<string> = null

  constructor(public name: string) {}

  greet(err: Error, say: string
    , callback: (err: Error, greet: string) => void) {
    // this._callback = callback
    process.nextTick(() => {
      try {
        callback(err, `${say}, ${this.name}`)
      } catch(err) {
        callback(err, null)
      }
    })
  }
}

test.cb('promisify > testObj', t => {
  const obj = new TestObj('bynaki')
  obj.greet(new Error('its error!!'), 'hello'
    , (err: Error, greeting: string): void => {
    t.is(err.message, 'its error!!')
    t.is(greeting, 'hello, bynaki')
    t.end()
  })
})

test.cb('promisify > 기본인수 전달', t => {
  const obj = new TestObj('bynaki')
  obj._greet = $4.promisify(obj.greet)
  obj._greet(null, 'hello')
  .then(greeting => {
    t.is(greeting, 'hello, bynaki')
    t.end()
  })
  .catch(err => t.fail())
})

test.cb('promisify > 에러 처리', t => {
  const obj = new TestObj('bynaki')
  obj._greet = $4.promisify(obj.greet)
  obj._greet(new Error('its error!!'), 'hello')
  .then(greeting => t.fail())
  .catch(err => {
    t.is(err.message, 'its error!!')
    t.end()
  })
})

test.cb('promisify > context를 지정하지 않았을 때 greet 메서드가 this를 참조하므로 에러가 나야한다.'
  , t => {
  const obj = new TestObj('bynaki')
  const greet = $4.promisify(obj.greet)
  greet(null, 'hello')
  .then(() => t.fail())
  .catch(err => {
    t.regex(err.message, /name/)
    t.end()
  })
})

test.cb('promisify > 에러를 반환하지 않는 콜백이라면', t => {
  const obj = new TestObj('bynaki')
  obj._greet = $4.promisify(obj.greet, false)
  obj._greet('not error!!' as any, 'hello')
  .then(args => {
    t.is(args.length, 2)
    t.is(args[0], 'not error!!')
    t.is(args[1], 'hello, bynaki')
    t.end()
  })
})

test('promisify > context를 직접 지정한다면', async t => {
  const obj = new TestObj('bynaki')
  const obj2 = {
    name: 'rabbit'
  }
  const greet = $4.promisify(obj.greet, obj2)
  const greeting = await greet(null, 'hello')
  t.is(greeting, 'hello, rabbit')
})

test('promisify > hasErr와 context 둘다 지정', async t => {
  const obj = new TestObj('bynaki')
  const greet = $4.promisify<(err: Error, say: string) => Promise<any[]>>(
    obj.greet, false, obj)
  const res = await greet('not error!!', 'hello')
  t.is(res.length, 2)
  t.is(res[0], 'not error!!')
  t.is(res[1], 'hello, bynaki')
})

test('promisify > hasErr와 context를 순서를 바꿔 지정', async t => {
  const obj = new TestObj('bynaki')
  const greet = $4.promisify(obj.greet, obj, true)
  const greeting = await greet(null, 'hello')
  t.is(greeting, 'hello, bynaki')
})

test('promisify > 엄한 인수 전달', t => {
  try {
    const obj = new TestObj('bynaki')
    const greet = $4.promisify(obj.greet, obj, 33)
    t.fail()
  } catch(err) {
    console.log(err.message)
    t.is(err.message, 'argument 전달이 잘못됐다.')
  }
})

test('promisify > async-await', async t => {
  const obj = new TestObj('bynaki')
  const greet = $4.promisify(obj.greet, obj)
  const greeting: string = await greet(null, 'hello')
  t.is(greeting, 'hello, bynaki')
})