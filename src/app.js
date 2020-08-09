
import systemFrame from './components/system-frame/index.vue';
import './plugins/element.js'

import extend from './extend/extend.js';



// Declare install function executed by Vue.use()
//支持组件的按需引入，不传options则为全部引入
export function install(Vue, options) {
  if (install.installed) return;
  install.installed = true;
  extend(Vue);
  if (!options || options.systemFrame) {
    Vue.component('system-frame', systemFrame);
  }
}
// Create module definition for Vue.use()
const plugin = {
  install,
};
// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}


// 再分别导出
export {
  systemFrame,
};
// To allow use as module (npm/webpack/etc.) export component
export default {
  systemFrame,
  install,
};
