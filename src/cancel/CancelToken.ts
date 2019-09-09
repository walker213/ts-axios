import { CancelExecutor, CancelTokenSource, Canceler } from "../types";
import Cancel from './Cancel'  // 类，不仅仅可以当值也可以当类型？

interface ResolvePromise{
	(reason?: Cancel):void
}

// 给axios增加一个属性CancelToken，它是一个类，接受一个executor函数，实例化化的时候的时候执行executor
// 会得到一个实例，该实例拥有一个pendding状态的promise对象以及未作为resolved值 的 reason
export default class CancelToken{
	promise: Promise<Cancel>
	reason?: Cancel
	
	constructor(executor: CancelExecutor) {
		let resolvePromise: ResolvePromise

		this.promise = new Promise<Cancel>(resolve => {   // Promise泛型，保证最后得到的值是Cancel类型？
			resolvePromise = resolve  // 取出resolve，以供外部使用，可以自定义触发更改promise对象的状态
		})

		executor(message => {  // executor接受一个cancel函数作为参数，调用该cancel函数会调用上面取出的resovlePromise
			// 防止重复调用
			if (this.reason) {
				return 
			}
			this.reason = new Cancel(message)
			resolvePromise(this.reason) 
		})
	}

	throwIfRequested() {
		if (this.reason) {
			throw this.reason
		}
	}

	// 相当于一个工厂函数，可以得到一个对象，该对象包括：一个cancelToken以及 一个可以更改cancelToken.promise状态的 cancel方法
	static source(): CancelTokenSource{
		let cancel!: Canceler
		const cancelToken = new CancelToken(c => {
			cancel = c
		})
		return {
			cancel,
			cancelToken
		}
	}
	
}