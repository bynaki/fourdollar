import {
  IWriter
} from './Logger'




export class MemoryWriter implements IWriter {
  private _other: IWriter
  private _m: string[] = []
  private _old: string[] = []

  constructor(public limit: number = 1000) {
  }

  private _check() {
    if(this._m.length >= this.limit) {
      this._old = this._m
      this._m = []
    }
  }

  private _message(type: string, msg: string): void {
    this._check()
    this._m.push(`${type}: ` + msg)
  }

  log(msg: string): void {
    this._message('log', msg)
  }

  error(msg: string): void {
    this._message('err', msg)
  }

  write(msg: any): void {
    this._check()
    switch(typeof(msg)) {
      case 'string': {
        this._m.push(msg)
        break
      }
      case 'number': {
        this._m.push(msg.toString())
        break
      }
      case 'boolean': {
        this._m.push(msg? 'true' : 'false')
        break
      }
      default: {
        this._m.push(JSON.stringify(msg))
      }
    }
  }

  get memory(): string[] {
    return this._old.concat(this._m)
  }

  get last(): string {
    if(this._m.length === 0) {
      return ''
    }
    return this._m[this._m.length - 1]
  }

  clear(): void {
    this._m = []
    this._old = []
  }

  get link() {
    return this._other
  }

  set link(other: IWriter) {
    this._other = other
  }
}