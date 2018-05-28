# fourdollar.logger

console log를 좀더 편리하게


## Install

```bash
$ yarn add fourdollar.logger
```


## Usage

```ts
import Logger from 'fourdollar.logger'

const logger = new Logger('Hello')
logger.log('hello', 1004)
logger.error('error!!')

// 2018-01-25 15:23:19.174 > Hello - hello 1004
// 2018-01-25 15:23:19.178 > Hello - error!!
```


## License

Copyright (c) bynaki. All rights reserved.

Licensed under the MIT License.
