import { AxiosInstance } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helpers/util";

// 工厂函数，返回一个混合类型的实例
function createInstance(): AxiosInstance {
  const context = new Axios();
  const instance = Axios.prototype.request.bind(context)  // 该实例本身是一个request函数， request貌似没有涉及this，为啥要绑定context？可不可以直接写成 instance=context.request ?

  extend(instance, context)  // 同时也是一个对象，把context上的原型属性及实例属性复制到自己身上

  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
