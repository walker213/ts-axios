import { AxiosTransformer } from "../types";

export default function transform(data:any,headers:any,fns?:AxiosTransformer|AxiosTransformer[]) {
	if (!fns) {
		return data
	}
	if (!Array.isArray(fns)) {
		fns=[fns]
	}
	fns.forEach(fn => {
		data = fn(data, headers)  // transform之后要返回data，作为下一个transform fn的参数 ， 管道调用  ，（ 但是为啥headers不用？）
	})
}