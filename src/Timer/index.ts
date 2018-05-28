/**
 * Timer
 */


type CallbackPack = {
  id: number
  callback: (...args: any[]) => void
  args: any[]
}


/**
 * Timer
 */
export class Timer {
  private _iterateList: CallbackPack[] = []
  private _onceList: CallbackPack[] = []
  private _id: number = 0
  private _t: any = null
  private _alter: boolean = true

  /**
   * 생성자
   * @param interval interval 시간간격 안에 등록된 callback들이 차례대로 실행된다.
   * @param minTick callback과 callback사이에 최소 시간간격을 설정할 수 있다.
   */
  constructor(public readonly interval: number, public readonly minTick?: number) {
    if(!minTick) {
      this.minTick = 0
    }
  }

  iterate(callback: (...args: any[]) => void, ...args: any[]): number {
    this._iterateList.push({
      id: ++this._id,
      callback,
      args,
    })
    this.start()
    return this._id
  }

  remove(id: number): boolean {
    let before = this._iterateList
    this._iterateList = this._iterateList.filter(o => {
      return o.id !== id
    })
    return before.length !== this._iterateList.length
  }

  once<T>(target: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this._onceList.push({
        id: 0,
        callback: function(...args: any[]) {
          target(...args).then(value => {
            resolve(value)
          }).catch(err => {
            reject(err)
          })
        },
        args,
      })
      this.start()
    })
  }

  start(): void {
    this.stop()
    let count = this._iterateList.length + this._onceList.length
    if(count === 0) {
      return
    }
    let tick = this.interval / count
    if(this.minTick) {
      tick = Math.max(tick, this.minTick)
    }
    this._t = setInterval(this._do.bind(this), tick)
  }

  stop(): void {
    if(this._t) {
      clearInterval(this._t)
      this._t = null
    }
  }

  get isStarted(): boolean {
    return !!this._t
  }

  private _nextCallback(): CallbackPack {
    let pack
    if(this._alter) {
      pack = this._iterateList.shift()
      if(pack) {
        this._iterateList.push(pack)
        this._alter = !this._alter
      } else {
        pack = this._onceList.shift()
      }
    } else {
      pack = this._onceList.shift()
      if(pack) {
        this._alter = !this._alter
      } else {
        pack = this._iterateList.shift()
        if(pack) {
          this._iterateList.push(pack)
        }
      }
    }
    return pack
  }

  private _do(): void {
    let pack = this._nextCallback()
    if(pack) {
      pack.callback(...pack.args)
    } else {
      this.stop()
    }
  }
}

export default Timer