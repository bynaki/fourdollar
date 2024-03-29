import fecha from 'fecha'


export interface IWriter {
  log: (msg: string) => void
  error: (msg: string) => void
  write: (msg: any) => void
  link?: IWriter
}

/**
 * 단순 console 로그
 */
export class DefaultWriter implements IWriter {
  private _other: IWriter

  private _message(type: string, msg: string): void {
    console.log(`\n${type}: ` + msg)
  }

  log(msg: string): void {
    this._message('log', msg)
  }

  error(msg: string): void {
    this._message('err', msg)
  }

  write(msg: any): void {
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


/**
 * Log
 */
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

  private _name: string

  /**
   * Log
   * @param name Log 이름
   */
  constructor(name: string = '') {
    this._name = name
  }

  /**
   * Log 이름. 아니면 클래스 이름
   */
  get name() {
    if(this._name !== '') {
      return this._name
    } else {
      return this.constructor.name
    }
  }

  protected _makeMsg(msgs: any[]) {
    const time = fecha.format(new Date(), myMask)
    const suitableMsgs = msgs.map(m => {
      if(typeof(m) === 'string') {
        return m
      } else if(m instanceof Error) {
        return `${m.name}: ${m.message}\n${m.stack}`
      } else {
        try {
          return JSON.stringify(m, null, 2)
        } catch(err) {
          return m
        }
      }
    })
    return _format.replace(':time:', time)
      .replace(':name:', this.name)
      .replace(':msg:', suitableMsgs.join('\n'))
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
