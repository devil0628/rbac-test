import Vue from 'vue'
import VueRouter from 'vue-router'
import {routers} from './router'
import NProgress from 'nprogress'
import authorityControl from './privileges'

import store from '../store'

Vue.use(VueRouter)


const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
const RouterConfig = {
    mode:'hash',

    base: __dirname,
    routes:routers

}
//登录页在后台，从初始路由进行处理
let token = window.location.hash.split("access_token=")[1];
let refresh_token = window.location.hash.split("refresh_token=")[1];
if(token){
    window.sessionStorage.setItem("access_token", token.split("&")[0]);
    window.localStorage.setItem("access_token", token.split("&")[0]);  //用户token的获取
    window.sessionStorage.setItem("refresh_token", refresh_token);
    window.sessionStorage.setItem("navData", "");
    store.commit('SET_TOKEN',token);
}

export  const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    // npropress 开启
   NProgress.start()
    // 权限控制
    authorityControl(to, from, next);
    NProgress.done();
});

router.afterEach((to) => {
    // 这边有坑，在 router 的 mode 为 hash 的情况下，router 的后置路由守卫是不会触发的
    NProgress.done()
    window.scrollTo(0, 0);
});


