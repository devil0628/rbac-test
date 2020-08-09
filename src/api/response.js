export const ERROR_CODE = {
  OK: 'ok',
  TOKEN_INVALID: 'INVALID_TOKEN',
  SUCCESS: 0,
  AUTH_ERROR_403: '403_FORBID', //403无权限错误，前端拦截
};

/**
 * 这个函数的作用就是，简化根据stat.code判断是否成功的逻辑，不需要在多个页面写大量if else
 * @param res          后台返回的原始res数据
 * @returns {Promise}
 */
export const responseHandler = res => {
  let originData = res.data || res.list || {};
  //格式1：result:ok,code:113099
  if (originData.hasOwnProperty('result') && originData.hasOwnProperty('code')) {
    return new Promise((resolve, reject) => {
      if (originData.code === ERROR_CODE.SUCCESS) {
        resolve(originData.data);
      } else if (originData.code === ERROR_CODE.TOKEN_INVALID) {
        //token过期直接跳转到登录页
        location.href = '/login.html';
      } else {
        console.error(originData.result);
        reject(originData); //返回整个错误体
      }
    });
  } else if (originData.hasOwnProperty('result') && originData.hasOwnProperty('data')) {
    return new Promise((resolve, reject) => {
      if (originData.result === ERROR_CODE.OK) {
        resolve(originData.data);
      } else {
        reject(originData.result); //只返回相关的错误信息部分
      }
    });
  } else if (Array.isArray(originData)) {
    //格式2：[]
    return new Promise(resolve => {
      resolve(originData);
    });
  } else if (originData.hasOwnProperty('list')) {
    return new Promise(resolve => {
      resolve(originData);
    });
  }
};
