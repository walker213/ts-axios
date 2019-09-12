import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from "../types";
import dispatchRequest, { transformURL } from './dispatchRequest';
import InterceptorManager from "./InterceptorManager";
import mergeConfig from "./mergeConfig";


interface Interceptors {
	request: InterceptorManager<AxiosRequestConfig>
	response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
	resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
	rejected?: RejectedFn
}

export default class Axios {
	defaults: AxiosRequestConfig
	interceptors: Interceptors    // axios的一个属性，值是一个obj

	constructor(initConfig: AxiosRequestConfig) {
		this.defaults = initConfig
		this.interceptors = {
			request: new InterceptorManager<AxiosRequestConfig>(),
			response: new InterceptorManager<AxiosResponse>()
		}
	}

	request(url: any, config?: any): AxiosPromise {
		if (typeof url === 'string') {
			if (!config) config = {};
			config.url = url
		} else {
			config = url
		}

		config = mergeConfig(this.defaults, config)

		const chain: PromiseChain<any>[] = [   // <any> 可以改成 <AxiosRequestConfig | AxiosResponse> 吗？
			// 初始值
			{
				resolved: dispatchRequest,  // resolved状态的值经过请求后从 AxiosRequestConfig => AxiosResponse
				rejected: undefined
			}
		]

		this.interceptors.request.forEach(interceptor => {  // 把request对象中的interceptor unshift到chain中 , 后加入的调到最前头 ， 后添加的先执行
			chain.unshift(interceptor)
		})

		this.interceptors.response.forEach(interceptor => {  // 把response对象中的interceptor push到chain中
			chain.push(interceptor)
		})

		let promise = Promise.resolve(config)

		// 利用promise链式调用
		while (chain.length) {
			const { resolved, rejected } = chain.shift()!   // 拿出chain中的第一个interceptor  ，  为啥要断言不为空？
			promise = promise.then(resolved, rejected)
		}


		return promise
	}

	// 该函数主要是提炼 合并config功能 的公共代码
	_requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this.request({ ...config, method: 'get', url })  // 实际上就是调用request，指定config里的method及url，所以后续代码可以断言url不为空
	}

	_requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this.request({ ...config, method: 'get', url, data })  // 实际上就是调用request，指定config里的method及url，把data合并到config里面去
	}

	get(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('get', url, config)
	}
	delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('get', url, config)
	}
	head(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('get', url, config)
	}
	options(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('get', url, config)
	}

	post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData('post', url, data, config)
	}

	put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData('put', url, data, config)
	}

	patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData('patch', url, data, config)
	}

	getUri(config?: AxiosRequestConfig): string {
		config = mergeConfig(this.defaults, config)
		return transformURL(config)
	}

}
