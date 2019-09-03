import { ResolvedFn, RejectedFn } from "../types";

// 不是公用interface可以定义在当前文件中
interface Interceptor<T> {
	resolved: ResolvedFn<T>
	rejected?: RejectedFn
}

export default class InterceptorManager<T>{   // 在调用new InterceptorManager()时会传入泛型T
	private interceptors: Array<Interceptor<T> | null>   // 用来存储interceptor拦截器的array
	constructor() {
		this.interceptors = []
	}
	use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
		this.interceptors.push({
			resolved,
			rejected
		})
		return this.interceptors.length - 1   // 返回该interceptor的id
	}

	// 遍历拦截器，提供给外部已访问interceptors，参数是一个fn（内部使用，不需要在公共type中定义）
	forEach(fn: (interceptor: Interceptor<T>) => void): void {
		this.interceptors.forEach(interceptor => {
			if (interceptor !== null)
				fn(interceptor)
		})
	}

	eject(id: number): void {
		if (this.interceptors[id]) {
			this.interceptors[id] = null  // id为interceptors的length，为避免影响到id，不能直接删除元素，只能置为null
		}
	}
}