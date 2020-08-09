import {post,put,get,deleteFun} from "./../request";

/** 租户删除接口，同时删除机构*/
 function deleteTenant(tenantId) {
    return deleteFun('/tenants/'+tenantId)
}
/** 租户基本信息查询接口*/
function detail(tenantId) {
    return get('/tenants/'+tenantId)
}
/** 租户新增接口,同时新增管理员*/
function create(param) {
    return post('/tenants',param)
}
/** 租户查询接口*/
function search(pageSize,pageNum,param) {
    return post('/tenants/condition/'+pageSize+'/'+pageNum,param)
}
/** 租户编辑接口*/
function update(tenantId,param) {
    return put('/tenants/'+tenantId,param)
}

 const tenantApi = {
     deleteTenant,
     detail,
     create,
     search,
     update,
}

export default tenantApi
