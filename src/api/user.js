//涉及到登陆和菜单的权限等接口
import {post,put,postJson,get} from "./request";

//登陆
function login(param) {
    return postJson('login/session',param)
}
//获取当前的登陆信息
function getPersonInfo() {
    return  get('/users/current')

}
function getMenu() {
    return get('/users/current/menus')
}

/**
 * 修改密码
 */
function changePwd(param){
    return put('/users/current/pwd',param)
}
/**
 * 切换角色
 */
function changeRole(roleId){
    return put('/users/current/roles/'+roleId)
}


export {
    login,getPersonInfo,getMenu,changePwd,changeRole
}
