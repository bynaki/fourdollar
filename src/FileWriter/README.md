# fourdollar.filewriter

file stream log 지원


## Install

```bash
$ yarn add fourdollar.filewriter
```


## Usage

```ts
import Logger from 'fourdollar.logger'
import FileWriter from 'fourdollar.filewriter'
import {
  join,
} from 'path'

const origin = Logger.writer
// console writer를 file stream 으로 바꾼다.
Logger.writer = new FileWriter(join(__dirname, 'access.log'))
const logger = new Logger('Hello')
logger.log('hello', 'world')
logger.error('error!!')

Logger.writer = origin
// console writer 와 file(1일 rotating) stream 을 같이 사용한다.
Logger.writer.link = new FileWriter(join(__dirname, 'access.log'), '1d')
logger.log('foobar')
```


## License

Copyright (c) bynaki. All rights reserved.

Licensed under the MIT License.
