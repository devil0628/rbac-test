import Cookies from 'js-cookie';
import { LOCALSTORAGE_KEYS } from './ovoSystem';
//共享cookie登录信息的域名白名单的根域名
export const DOMAIN_ROOT = 'ovopark.com';

const cookieParams = { domain: DOMAIN_ROOT };

export const getCookieTicket = function() {
  return Cookies.get(LOCALSTORAGE_KEYS.TOKEN, cookieParams) || Cookies.get(LOCALSTORAGE_KEYS.TOKEN);
};

export const setCookieTicket = function(value) {
  Cookies.set(LOCALSTORAGE_KEYS.TOKEN, value, cookieParams);
  //Cookies.set(LOCALSTORAGE_KEYS.TOKEN, value);
};



export const setCookieOpenBaseInfo = function(value) {
  Cookies.set(LOCALSTORAGE_KEYS.NEED_OPENBASEINFO, value, cookieParams);
  //Cookies.set(LOCALSTORAGE_KEYS.NEED_OPENBASEINFO, value);
};

export const removeCookieTicket = function() {
  Cookies.remove(LOCALSTORAGE_KEYS.TOKEN, cookieParams);
  Cookies.remove(LOCALSTORAGE_KEYS.TOKEN);
};

export const removeCookieWebScocketId = function() {
  Cookies.remove(LOCALSTORAGE_KEYS.WEBSOCKETID, cookieParams);
  Cookies.remove(LOCALSTORAGE_KEYS.WEBSOCKETID);
};
export const removeCookieLoginReferrer = function() {
  Cookies.remove(LOCALSTORAGE_KEYS.LOGIN_REFERRER, cookieParams);
  Cookies.remove(LOCALSTORAGE_KEYS.LOGIN_REFERRER);
};

export const removeCookieOpenBaseInfo = function() {
  Cookies.remove(LOCALSTORAGE_KEYS.NEED_OPENBASEINFO, cookieParams);
  Cookies.remove(LOCALSTORAGE_KEYS.NEED_OPENBASEINFO);
};
