import { AxiosStatic,AxiosRequestConfig } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helpers/util";
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';
import CancelToken from './cancel/CancelToken'
import Cancel,{ isCancel } from "./cancel/Cancel";

// 工厂函数，返回一个混合类型的实例
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context)  // 该实例本身是一个request函数， request貌似没有涉及this，为啥要绑定context？可不可以直接写成 instance=context.request ?

  extend(instance, context)  // 同时也是一个对象，把context上的原型属性及实例属性复制到自己身上

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

// 为axios实例增加一个create方法，可以传入新的defaut config与原来的合并
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults,config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel


// 鸡肋
axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
