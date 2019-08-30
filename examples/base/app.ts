import axios from '../../src/index'

// *
// 处理params
// *

// axios({
// 	method: 'get',
// 	url: '/base/get',
// 	params: {
// 		foo: ['bar', 'baz']
// 	}
// })

// axios({
// 	method: 'get',
// 	url: '/base/get',
// 	params: {
// 		foo: {
// 			bar: 'baz'
// 		}
// 	}
// })

// const date = new Date()

// axios({
// 	method: 'get',
// 	url: '/base/get',
// 	params: {
// 		date
// 	}
// })

// axios({
// 	method: 'get',
// 	url: '/base/get',
// 	params: {
// 		foo: '@:$, '
// 	}
// })

// axios({
// 	method: 'get',
// 	url: '/base/get',
// 	params: {
// 		foo: 'bar',
// 		baz: null
// 	}
// })

// axios({
// 	method: 'get',
// 	url: '/base/get#hash',
// 	params: {
// 		foo: 'bar'
// 	}
// })

// axios({
// 	method: 'get',
// 	url: '/base/get?foo=bar',
// 	params: {
// 		bar: 'baz'
// 	}
// })



// *
// 处理data,将普通对象改成json字符串
// *

// axios({
// 	method: 'post',
// 	url: '/base/post',
// 	data: {
// 		a: 1,
// 		b:2
// 	}
// })

// const arr = new Int32Array([21,31])
// axios({
// 	method: 'post',
// 	url: '/base/buffer',
// 	data: arr
// })



// *
// 处理req headers,为普通对象添加content-type
// *

// axios({
// 	method: 'post',
// 	url: '/base/post',
// 	data: {
// 		a: 1,
// 		b: 2
// 	}
// })

// axios({
// 	method: 'post',
// 	url: '/base/post',
// 	headers: {
// 		'content-type': 'application/json;'
// 	},
// 	data: {
// 		a: 1,
// 		b: 2
// 	}
// })

// 浏览器发现data是特殊对象，会自动为request headers的content-type设置对应的值 
// const paramsString = 'q=URLUtils.searchParams&topic=api'
// const searchParams = new URLSearchParams(paramsString)

// axios({
// 	method: 'post',
// 	url: '/base/post',
// 	data: searchParams
// })



// 把res改成promise，req可以传入responseType
axios({
	method: 'post',
	url: '/base/post',
	data: {
		a: 1,
		b: 2
	}
}).then((res) => {
	console.log(res)
})

axios({
	method: 'post',
	url: '/base/post',
	responseType: 'json',   // 浏览器会自动吧json字符串解析为 普通对象
	data: {
		a: 3,
		b: 4
	}
}).then((res) => {
	console.log(res)
})