import {
  IWriter
} from './Logger'




export class MemoryWriter implements IWriter {
  private _other: IWriter
  private old: string[] = []
  private m: string[] = []

  constructor(public limit: number = 1000) {
  }

  private _check() {
    if(this.m.length >= this.limit) {
      this.old = this.m
      this.m = []
    }
  }

  private _message(type: string, msg: string): void {
    this._check()
    this.m.push(`${type}: ` + msg)
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
        this.m.push(msg)
        break
      }
      case 'number': {
        this.m.push(msg.toString())
        break
      }
      case 'boolean': {
        this.m.push(msg? 'true' : 'false')
        break
      }
      default: {
        this.m.push(JSON.stringify(msg))
      }
    }
  }

  get memory(): string[] {
    return this.old.concat(this.m)
  }

  get last(): string {
    if(this.m.length === 0) {
      return ''
    }
    return this.m[this.m.length - 1]
  }

  get link() {
    return this._other
  }

  set link(other: IWriter) {
    this._other = other
  }
}