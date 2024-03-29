/**
 * test url
 */

import test from 'ava'
import $4, {
  toStringQuery,
} from '../src'


test('Url > toStringQuery() > query가 없을때 ""을 반환한다.', t => {
  t.is(toStringQuery({}), '')
  t.is(toStringQuery('' as any), '')
})

test('Url > toStringQuery() > query가 하나일때 올바르게 반환한다.', t => {
  let result = toStringQuery({hello: 'world'})
  t.is(result, '?hello=world')
})

test('Url > toStringQuery() > query가 하나 이상일때 올바르게 반환한다.', t => {
  let result = toStringQuery({hello: 'world', foo: 'bar'})
  t.is(result, '?hello=world&foo=bar')
})

test('Url > toStringQuery() > query가 string이 아닐때도 가능하다.', t => {
  const result = toStringQuery({start: 100, end: 200})
  t.is(result, '?start=100&end=200')
})
