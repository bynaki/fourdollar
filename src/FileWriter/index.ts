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


export interface IWriter {
  log: (msg: string) => void
  error: (msg: string) => void
  link?: IWriter
}

export class FileWriter implements IWriter {
  private _stream: WriteStream

  constructor(path: string, interval?: string) {
    if(interval) {
      let dir = dirname(path)
      let file = basename(path)
      ensureDirSync(dir)
      this._stream = rfs(file, {
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
}

export default FileWriter