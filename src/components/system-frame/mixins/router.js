
import { LOCALSTORAGE_KEYS,  } from '../../../common/js/ovoSystem';

/**
 * 路由跳转集中处理
 */
export const routerMixins = {
  methods: {
    verifyRouter(to, from, next) {
      if (!this.invokeRouterInterceptor(to)) {

      } else {
        if (to.meta.needPassword && from.name != 'verifypassword') {
          localStorage.setItem(LOCALSTORAGE_KEYS.PASSWORD_NEXT, to.name);
          next({
            name: 'verifypassword',
            params: {
              nextRouterName: to.name, // 把跳转的路由name作为参数传到密码验证页，用于密码通过跳转回去
            },
          });
        } else {
          next();
        }
      }
    },

    /**
     * 路由跳转方法，提供两种模式的跳转
     * 1,如果当前路由检测到在当前系统之内，才用this.$route.push方式跳转
     * 2.其他全部使用重定向或打开新网页的方式
     */
    goRouter(childItem) {
      if (this.hasRouter(childItem.router)) {
        this.$router.push(childItem.router.url);
      } else {
        this.openSystemUrl(childItem);
      }
    },
    /**
     * 判断方法
     */
    hasRouter({ system, url }) {
      if (system !== this.$system.$systemNo) {
        //如果当前系统和目标系统不一致就打开新系统
        return false;
      }
      let matches = this.$router.match(url).matched; //匹配路由结果
      if (matches && matches.length > 0) {
        if (url.indexOf('404') === -1 && matches[0].name === '404') {
          //除了404界面，其他匹配到的404则不会认为是匹配路由成功
          return false;
        }
        return true;
      } else {
        return false;
      }
    },
    /**
     * 跳转对应的页面
     * @param isBlank 是否在新页面打开
     */
    openSystemUrl(childItem, isBlank = false) {
      if (!childItem.router || !childItem.router.system) {
        console.error(`${childItem.title}路由信息字段没填`);
        return false;
      }
    },
  },
};
