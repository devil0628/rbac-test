//router路由控制
import store from "../../store";
//import Cookies from 'js-cookie'
import {empty,accessControl} from "../../common/js/utils";
import {baseUrl} from 'common/js/config'
import {getMenu} from 'api/user.js'

function authorityControl (to, from, next) {
    const access_token = window.sessionStorage.getItem('access_token')  //后期可以考虑使用cookie,设置时长，原来的逻辑用session来判断
    if(!window.sessionStorage.getItem('navData')){
        let homePath = '/404';
        getMenu().then(res =>{
            if(res.status==200){
                window.sessionStorage.setItem('navData',JSON.stringify(res.data.menus));
                store.commit('SET_MENULIST',res.data.menus);
                if(res.data.menus){
                    for(let m of res.data.menus){
                        if(m.address){
                            homePath = m.address;
                            break;
                        }else if(m.subMenus){
                            homePath = m.subMenus[0].address;
                            break;
                        }
                    }
                }
                window.sessionStorage.setItem('navDefaultPath', homePath);
                window.location.href = window.location.href.substring(0,window.location.href.indexOf("#"));
            }else {
                alert(res.message);
            }
        })
    }else {
        if(access_token){
            let str = window.sessionStorage.getItem('navData');
            store.commit('SET_MENULIST',JSON.parse(str));
            accessControl(to, store.state.menuList, next)
        }else {
            window.location = baseUrl+'/rbac/login'
        }
    }
}
export  default authorityControl;
