/**
 * test url
 */

import test from 'ava'
import {
  toStringQuery,
} from '../src/fourdollar'
import * as $4 from '../src/fourdollar'


test('Url > toStringQuery() > query가 없을때 ""을 반환한다.', t => {
  t.is(toStringQuery({}), '')
  t.is(toStringQuery('' as any), '')
})

test('Url > toStringQuery() > query가 하나일때 올바르게 반환한다.', t => {
  let result = toStringQuery({hello: 'world'})
  t.is(result, 'hello=world')
})

test('Url > toStringQuery() > query가 하나 이상일때 올바르게 반환한다.', t => {
  let result = toStringQuery({hello: 'world', foo: 'bar'})
  t.is(result, 'hello=world&foo=bar')
})
