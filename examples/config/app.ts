import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs';

axios.defaults.headers.common['test2'] = 123

axios({
	url: '/config/post',
	method: 'post',
	data: qs.stringify({ a: 1 }),  // 变成form-data?
	headers: {
		test: '321'
	}
}).then(res => {
	console.log(res.data)
})



axios({
	transformRequest: [
		(function (data) {
			return qs.stringify(data)
		}),
		...(axios.defaults.transformRequest as AxiosTransformer[])
	],
	transformResponse: [
		...(axios.defaults.transformResponse as AxiosTransformer[]), 
		function(data) {
			if (typeof data === 'object') {
				data.b=2
			}
			return data
		}
	],
	url: '/config/post',
	method: 'post',
	data: {
		a:1
	}
}).then(res => {
	console.log(res.data)
})



// 传入新的默认配置创建一个新的 axios 实例
const instance = axios.create({
	transformRequest: [
		(function (data) {
			return qs.stringify(data)
		}),
		...(axios.defaults.transformRequest as AxiosTransformer[])
	],
	transformResponse: [
		...(axios.defaults.transformResponse as AxiosTransformer[]),
		function (data) {
			if (typeof data === 'object') {
				data.b = 2
			}
			return data
		}
	]
})

instance({
	url: '/config/post',
	method: 'post',
	data: {
		a: 1
	}
}).then(res => {
	console.log(res.data)
})