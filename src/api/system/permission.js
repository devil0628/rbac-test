import {post,put,get,deleteFun} from "./../request";

/** 功能权限删除，删除菜单的关联和角色的关联引用 */
function deletePerm(permsId) {
    return deleteFun('/permission/functions/'+permsId)
}
/** 功能权限基本信息查询接口*/
 function detail(permsId) {
    return get('/permission/functions/'+permsId)
}
/** 功能权限新增*/
function create(param) {
    return post('/permission/functions',param)
}
/** 功能权限查询接口，组合查询。*/
function search(pageSize,pageNum,param) {
    param = param||{};
    param._menus = true;
    param._roles = true;
    param._products = true;
    return post('/permission/functions/condition/'+pageSize+'/'+pageNum,param)
}
/** 功能权限查询接口，组合查询。*/
function searchSimple(pageSize,pageNum,param) {
    return post('/permission/functions/condition/simple/'+pageSize+'/'+pageNum,param)
}
/** 功能权限绑定菜单接口，如果permsId为[]时，删除功能权限绑定的所有菜单。*/
function bindMenus(permsId,param) {
    return post('/permission/functions/'+permsId+'/menus',param)
}
/** 功能权限编辑*/
function update(permsId,param) {
    return put('/permission/functions/'+permsId,param)
}

 const permsApi = {
     deletePerm,
     detail,
     create,
     search,
     searchSimple,
     bindMenus,
     update,
}

export default permsApi
