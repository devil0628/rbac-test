import {getPersonInfo} from '../../api/user.js'
import store from "../index";

export {
    fetchPersonInfo
}



/**
 * 获取用户信息 action
 * @param state
 * @param commit
 * @returns {Promise}
 */
function fetchPersonInfo ({ state, commit }) {
    return new Promise((resolve, reject) => {
        getPersonInfo().then(res => {
            // 存储权限数据到 store

            //处理角色名称
            if(res.data && res.data.roles){
                let currentMultiName = "";
                for(let role of res.data.roles){
                    let multiName = role.prodName;
                    if(role.tenantName){
                        multiName += " / "+role.tenantName;
                    }
                    if(role.orgName){
                        multiName += " / "+role.orgName;
                    }
                    multiName += " / "+role.roleName;
                    if(role.roleId == res.data.currentRoleId){
                        currentMultiName = multiName;
                    }
                    role.roleMultiName = multiName;
                }
                res.data.currentRoleMultiName = currentMultiName;
            }
            store.commit('SET_USERINFO', res.data)
            resolve(res)
        }).catch(e => reject)
    })
}


