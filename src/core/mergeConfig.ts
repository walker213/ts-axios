import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helpers/util";

const strats = Object.create(null)

// 默认策略
function defaultStrat(val1: any, val2: any): any{
	return typeof val2 !== 'undefined' ? val2 : val2;
}

// 以自定义的config2为准，忽略原有的默认值（因为有可能被用户修改过）
function fromVal2Strat(val1: any, val2: any): any{
	if (typeof val2 !== 'undefined') {
		return val2
	}
}

// 深拷贝
function deepMergeStrat(val1:any, val2: any) {
	if (isPlainObject(val2)) {
		return deepMerge(val1,val2)
	} else if (typeof val2 !== 'undefined') {  // 有值并且不是对象
		return val2
	} else if (isPlainObject(val1)) {
		return deepMerge(val1)
	} else if (typeof val1 !== 'undefined'){
		return val1
	}
}


const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
	strats[key]=fromVal2Strat
})

const stratKeysDeepMerge = ['header']
stratKeysDeepMerge.forEach(key => {
	strats[key] = deepMergeStrat
})


export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
	if (!config2) {
		config2 = {}
	}
	const config = Object.create(null)
	for (let key in config2) {
		mergeField(key)
	}
	for (let key in config1) {
		if (!config2[key]) {
			mergeField(key)
		}
	}

	function mergeField(key: string): void{
		const strat = strats[key] || defaultStrat
		config[key]=strat(config1[key],config2![key])   // 断言config2不为空
	}

	return config
}