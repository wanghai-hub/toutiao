import axios from 'axios'
import auth from '@api/auth.js'
import router from '../router/index'
import Jsonbig from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
const token = auth.getuser().token
// axios.defaults.headers.Authorization = `Bearer ${token}`

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 修改配置项config，追加新token 
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  axios.transformResponse = [function(data) {
    try{
      return Jsonbig.parse(data)
    }catch(e) {}
    return data
  }]

  // 添加响应拦截器
 axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
   if(error.response && error.response.status === 401) {
       auth.deletuser()
        router.push('/login')
   }
    return Promise.reject(error);
  });

export default axios