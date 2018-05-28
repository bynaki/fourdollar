# fourdollar

개인적인 라이브러리 이다.

`test/*.spec.ts`를 참고하라.


## Install

```bash
$ yarn add fourdollar
```


## Usage

```ts
import * as $4 from 'fourdollar'
```


## Publish

```bash
$ yarn build.tsc      # 일단 빌드한다
$ npm login           # 로그인
$ npm publish         # 프로젝트의 루트 위치에서, npm에 배포 등록한다
$ cd build/promisify
$ yarn build.tsc
$ npm publish         # 개별적으로 배포 등록한다
```


## License

Copyright (c) bynaki. All rights reserved.

Licensed under the MIT License.
