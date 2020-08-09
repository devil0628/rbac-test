import axios from 'axios'
import qs from 'qs'
import {responseHandler} from "./axios.config";
import Cookies from 'js-cookie'

axios.defaults.timeout = 300000;   //300秒超时

const serverPath = "/rbac"

/**
 * 获取token
 * @returns {string}
 */
export const getToken = function() {
  let token = Cookies.get('access_token');
  if (!token) {
    token = localStorage.getItem('access_token');
  }
  return token;
};


/**
 * get
 * @param url
 * @param params
 * @returns {Promise<void>}
 */
export  const get =  async function (url,params ={},server=serverPath) {
  let res =await axios.get(server+url,{params,headers:{
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' +getToken(),
    }})
  return responseHandler(res);
}
/**
 * delete
 * @param urls
 * @param params
 * @returns {Promise<void>}
 */
export  const  deleteFun =  async function (url,params ={},server=serverPath) {
  let res =await axios.delete(server+url,{params,headers:{
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' +getToken(),
    }})
  return responseHandler(res);
}
/**
 * post请求
 * @param url
 * @param params
 * @returns {Promise<*>}
 */
export const post = async function(url,params ={},server=serverPath){
  let res = await axios.post(server+url,params,{
    headers:{
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' +getToken(),
    }
  })
  return responseHandler(res);
}

export const put = async function(url,params ={},server=serverPath){
  let res = await axios.put(server+url,params,{
    headers:{
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' +getToken(),
    }
  })
  return responseHandler(res);
}

export const postJson = async function(url,params ={},server=serverPath){  //这种不需要token,目前仅用于登陆
  let res = await axios.post(server+url,params,{
    headers:{
      'Content-Type': 'application/json'
    }
  })
  return responseHandler(res);
}


/**
 * 上传文件
 * @param url
 * @param params
 * @returns {*}
 */
export const postFile = async function(url, formdata,server=serverPath) {
  let res = await axios({
    url: server+url,
    method: 'post',
    data: formdata,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer '+getToken(),
    },
  });
  return responseHandler(res);
};

/**
 * 导出
 * @param url
 * @param params
 */
export const postExportFile = async function(url, params,server=serverPath) {
  let res = await axios.post(server+url, qs.stringify(params), {
    headers: { Authorization: 'Bearer '+getToken() },
  });
  return res;
};
