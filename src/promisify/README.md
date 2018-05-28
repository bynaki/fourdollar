# fourdollar.promisify


## Install

```bash
$ yarn add fourdollar.promisify
```


## Usage

```ts
import promisify from 'fourdollar.promisify'
import {readFile} from 'fs'

async function readMe() {
  const readFile_ = promisify<(filename: string) => Promise<Buffer>>(readFile)
  return await readFile_(__dirname + '/promisify.ts')
}

readMe().then((buffer) => {
  console.log(buffer.toString())
})
```


## License

Copyright (c) bynaki. All rights reserved.

Licensed under the MIT License.
