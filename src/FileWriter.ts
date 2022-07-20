import {
  ensureDirSync,
  WriteStream,
  createWriteStream,
} from 'fs-extra'
import * as rfs from 'rotating-file-stream'
import {
  dirname,
  basename,
} from 'path'
import {
  IWriter,
} from './Logger'


// export interface IWriter {
//   log: (msg: string) => void
//   error: (msg: string) => void
//   link?: IWriter
// }

/**
 * Log를 파일로
 */
export class FileWriter implements IWriter {
  private _stream: WriteStream|rfs.RotatingFileStream

  /**
   * Log를 파일로
   * @param path 저장할 파일경로
   * @param interval 장기간 로그할때 파일을 따로 저장. 예: '1d'
   */
  constructor(path: string, interval?: string) {
    if(interval) {
      let dir = dirname(path)
      let file = basename(path)
      ensureDirSync(dir)
      this._stream = rfs.createStream(file, {
        interval,
        path: dir,
      })
    } else {
      let dir = dirname(path)
      ensureDirSync(dir)
      this._stream = createWriteStream(path, {
        flags: 'a',
      })
    }
  }

  private _message(type: string, msg: string): void {
    this._stream.write(`\n${type}: ` + msg)
  }

  log(msg: string): void {
    this._message('log', msg)
  }

  error(msg: string): void {
    this._message('err', msg)
  }

  write(msg: any): void {
    this._stream.write(`\n${msg}`)
  }
}
