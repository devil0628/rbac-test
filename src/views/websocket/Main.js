import Observer from './Observer';
import Emitter from './Emitter';

export default {
  install(Vue, connection, opts = {}) {
    if (!connection) {
      throw new Error('[vue-native-socket] cannot locate connection');
    }
    let observer = null;

    opts.$setInstance = wsInstance => {
      Vue.prototype.$socket = wsInstance;
    };
    if (opts.connectManually) {
      //这里构造函数增加当前实例对象
      Vue.prototype.$connect = (connectionUrl = connection, vm = {}, connectionOpts = opts) => {
        observer = new Observer(connectionUrl, connectionOpts, vm);
        Vue.prototype.$socket = observer.WebSocket;
      };

      Vue.prototype.$disconnect = () => {
        if (observer && observer.reconnection) {
          observer.reconnection = false;
        }
        if (Vue.prototype.$socket) {
          Vue.prototype.$socket.close();
          delete Vue.prototype.$socket;
        }
      };
    } else {
      observer = new Observer(connection, opts);
      Vue.prototype.$socket = observer.WebSocket;
    }
    const hasProxy =
      typeof Proxy !== 'undefined' && typeof Proxy === 'function' && /native code/.test(Proxy.toString());

    Vue.mixin({
      created() {
        let vm = this;
        let sockets = this.$options['sockets'];
        if (hasProxy) {
          this.$options.sockets = new Proxy(
            {},
            {
              set(target, key, value) {
                Emitter.addListener(key, value, vm);
                target[key] = value;
                return true;
              },
              deleteProperty(target, key) {
                Emitter.removeListener(key, vm.$options.sockets[key], vm);
                delete target.key;
                return true;
              },
            }
          );
          if (sockets) {
            Object.keys(sockets).forEach(key => {
              this.$options.sockets[key] = sockets[key];
            });
          }
        } else {
          //不支持Proxy的情况，在connect方法里面再去添加事件监听
          if (!sockets) this.$options.sockets = {};
        }
      },
      beforeDestroy() {
        if (hasProxy) {
          let sockets = this.$options['sockets'];

          if (sockets) {
            Object.keys(sockets).forEach(key => {
              delete this.$options.sockets[key];
            });
          }
        }
      },
    });
  },
};
