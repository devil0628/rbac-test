import {
  setCookieTicket,
  setCookieLanguage,
  setCookieLoginReferrer,
  setCookieOpenBaseInfo,
  setCookieWebScocketId,
  removeCookieTicket,
  removeCookieWebScocketId,
  removeCookieLoginReferrer,
  removeCookieOpenBaseInfo,
  getCookieTicket,
  getCookieLanguage,
  getCookieWebScocketId,
  getCookieLoginReferer,
} from './cookieutil';

//所有Localstoragekey
//ovo_前缀的会涉及到跨域共享的
export const LOCALSTORAGE_KEYS = {
  LANGUAGE: 'ovo_language', //当前语言环境
  WEBSOCKETID: 'ovo_webSocketId', //登录一次返回的websocketId,用于session过期时使用
  LOGIN_REFERRER: 'ovo_loginReferrer', //登录页最好能设置此参数，在退出的时候能够准确回到登录页面
  TOKEN: 'ovo_ticket', //token
  NEED_OPENBASEINFO: 'ovo_openBaseInfo', //是否需要打开基本信息，因为基本信息在老系统中
  PASSWORD_NEXT: 'verify_password_next_router', //在验证密码后下一个要跳转的路由
};
/**
 * 获取token信息
 * 先从cookie中找，改动现在不从localstorage里面获取，本身token这种东西还是不要存在里面
 */
export const getToken = function() {
  // 从浏览器地址栏获取token
  if (window.location.search) {
    let params = window.location.search
      .substr(1, window.location.search.length - 1)
      .split('&')
      .map(i => i.split('='))
      .filter(v => v[0] === 'token' || v[0] === 'ticket');
    if (params && params.length > 0) {
      let token = params[0][1];
      if (token) {
        return token;
      }
    }
  }
  // 从cookie中获取token
  let token = getCookieTicket();
  if (token) {
    return token;
  }
  return token;
};

/**
 * 获取当前的语言环境,先从cookie里面找，找不到再到localstorage里面找，最后找不到再使用浏览器环境的
 */
export const getLanguage = function() {
  let cookieLang = getCookieLanguage();
  if (cookieLang) {
    return cookieLang;
  }
  let localStorageLang = localStorage.getItem(LOCALSTORAGE_KEYS.LANGUAGE);
  if (localStorageLang) {
    return localStorageLang;
  }
  return navigator.language;
};

/**
 * 先从localstorage里面找，登录页登录的时候会记录在localstorage里面
 */
export const getLoginReferrer = function() {
  let referrer = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_REFERRER);
  if (referrer) {
    return referrer;
  }
  referrer = getCookieLoginReferer();
  if (referrer) {
    return referrer;
  }
  return '';
};
/**
 * 先从localstorage里面找，登录页登录的时候会记录在localstorage里面
 */
export const getWebSocketId = function() {
  let websocketId = localStorage.getItem(LOCALSTORAGE_KEYS.WEBSOCKETID);
  if (websocketId) {
    return websocketId;
  }
  websocketId = getCookieWebScocketId();
  if (websocketId) {
    return websocketId;
  }
  return '';
};

export const setToken = function(token) {
  setCookieTicket(token); //仅设置到cookie中
};

export const setLanguage = function(value) {
  setCookieLanguage(value);
  localStorage.setItem(LOCALSTORAGE_KEYS.LANGUAGE, value);
};

export const setNeedOpenBaseInfo = function(value) {
  setCookieOpenBaseInfo(value); //仅设置到cookie中
};

export const setWebScoketId = function(value) {
  setCookieWebScocketId(value);
  localStorage.setItem(LOCALSTORAGE_KEYS.WEBSOCKETID, value);
};

export const setLoginRerfer = function(value) {
  setCookieLoginReferrer(value);
  localStorage.setItem(LOCALSTORAGE_KEYS.LOGIN_REFERRER, value);
};

export const clearWebScoketId = function() {
  localStorage.removeItem(LOCALSTORAGE_KEYS.WEBSOCKETID); //清除登录时设置的websocketId
  removeCookieWebScocketId();
};

export const clearTicket = function() {
  localStorage.removeItem(LOCALSTORAGE_KEYS.TOKEN);
  removeCookieTicket();
};

export const clearLoginReferrer = function() {
  localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_REFERRER);
  removeCookieLoginReferrer();
};

export const clearOpenBaseInfo = function() {
  localStorage.removeItem(LOCALSTORAGE_KEYS.NEED_OPENBASEINFO);
  removeCookieOpenBaseInfo();
};
