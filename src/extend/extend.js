import Websocket from '../components/system-frame/components/websocket/Main';
/**
 * 空方法，在实例中重新定义
 */
const emptyFunction = function() {};

export default function extend(Vue) {
  //添加权限相关全局方法
  if (!Vue.prototype.hasOwnProperty('$system')) {
    Vue.prototype.$system = {};
    //所有权限操作相关的方法将会注册在$auth上面
    Vue.prototype.$system.$auth = {};
    Vue.prototype.$system.$auth.isSuper = emptyFunction;
    Vue.prototype.$system.$auth.isRoot = emptyFunction;
    Vue.prototype.$system.$auth.isEnterpriseRoot = emptyFunction;

    Vue.prototype.$system.$systemNo = 0;
    //路由跳转方法
    Vue.prototype.$system.goRouter = emptyFunction;
    //注册当前系统组件的state
    Vue.prototype.$system.$state = {};
    //注册事件总线
    Vue.prototype.$eventbus = new Vue();
  } else {
    throw new Error('重复注册了系统全局方法');
  }

  //注册websocket
  Vue.use(Websocket, 'default', {
    //此处第二个参数初始化的时候没卵用，当是还一定要填
    connectManually: true,
    reconnection: true, //自动重连
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });
}
