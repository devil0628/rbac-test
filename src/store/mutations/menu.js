import {typeOf} from "../../common/js/utils";

const mutations = {
    SET_USERINFO(state,userInfo){
        if (typeOf(userInfo) === 'object') state.userInfo = userInfo;
    } ,
    SET_MENULIST(state,menuList){
        if (typeOf(menuList) === 'array') state.menuList = menuList;
    },
    SET_TOKEN(state,token){
        if (typeOf(token) === 'string') state.access_token = token;
    },
    SET_ORGTYPE(state,orgType){
        if (typeOf(orgType) === 'number') state.orgType = orgType;
    },
    SET_ROLETYPE(state,roleType){
        if (typeOf(roleType) === 'number') state.roleType = roleType;
    },
    SET_IFRAME(state,iframeUrl){
        state.iframeUrl = iframeUrl
    }

}

export default mutations;
