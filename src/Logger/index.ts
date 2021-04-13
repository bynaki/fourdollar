import fecha from 'fecha'


export interface IWriter {
  log: (msg: string) => void
  error: (msg: string) => void
  link?: IWriter
}

class DefaultWriter implements IWriter {
  private _other: IWriter

  log(msg: string): void {
    console.log(msg)
  }

  error(msg: string): void {
    console.log(msg)
  }

  get link() {
    return this._other
  }

  set link(other: IWriter) {
    this._other = other
  }
}

const myMask = 'YYYY-MM-DD HH:mm:ss.SSS'
let _writer: IWriter = new DefaultWriter()
let _format: string = ':time: > :name: - :msg:'

export class Logger {
  static get writer(): IWriter {
    return _writer
  }

  static set writer(writer: IWriter)  {
    _writer = writer
  }

  static get format(): string {
    return _format
  }

  static set format(format: string) {
    _format = format
  }

  constructor(public readonly name: string = '') {
  }

  protected _makeMsg(msgs: any[]) {
    const time = fecha.format(new Date(), myMask)
    return _format.replace(':time:', time)
      .replace(':name:', this.name).replace(':msg:', msgs.join(' '))
  }

  log(...msgs: any[]): void {
    const msg = this._makeMsg(msgs)
    let writer = Logger.writer
    while(writer) {
      writer.log(msg)
      writer = writer.link
    }
  }

  error(...msgs: any[]): void {
    const msg = this._makeMsg(msgs)
    let writer = Logger.writer
    while(writer) {
      writer.error(msg)
      writer = writer.link
    }
  }
}

export default Logger
