/**
 * test number
 */

import test from 'ava'
import {
  isInteger,
  isFloat,
} from '../src/fourdollar'
import $4 from '../src/fourdollar'

test('Numbers > isInteger() > 정수일때 true을 반환한다.', t => {
  t.true(isInteger('123'))
  t.true(isInteger('-12301'))
  t.true(isInteger('+12301'))
  t.true(isInteger('1'))
})

test('Numbers > isInteger() > 정수가 아닐때 false를 반환한다.', t => {
  t.false($4.isInteger('a1234'))
  t.false($4.isInteger('012a34'))
  t.false($4.isInteger('012.3a4'))
  t.false($4.isInteger(''))
})

test('Numbers > isFloat() > 소수점이 있을 때 true를 반환한다.', t => {
  t.true(isFloat('12.34'))
  t.true(isFloat('1.4'))
  t.true(isFloat('+12.34'))
  t.true(isFloat('-12.34'))
})

test('Numbers > isFloat() > 소수점이 없을 때, 잘못 됐을때 false를 반환한다.', t => {
  t.false($4.isFloat('1234'))
  t.false($4.isFloat('a1234'))
  t.false($4.isFloat('+1234'))
  t.false($4.isFloat('1+2.34'))
  t.false($4.isFloat('--12.34'))
  t.false($4.isFloat('.1234'))
  t.false($4.isFloat('1234.'))
  t.false($4.isFloat('12.3a4'))
})
