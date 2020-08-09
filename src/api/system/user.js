import {post,put,get,deleteFun} from "./../request";

/** 删除接口，同时删除*/
 function deleteUser(userId) {
    return deleteFun('/users/'+userId)
}
/** 基本信息查询接口*/
function detail(userId) {
    return get('/users/'+userId)
}
/** 新增接口*/
function create(param) {
    return post('/users',param)
}
/** 查询接口*/
function search(pageSize,pageNum,param) {
    return post('/users/condition/'+pageSize+'/'+pageNum,param)
}
/** 查询接口*/
function searchSimple(pageSize,pageNum,param) {
    return post('/users/condition/simple/'+pageSize+'/'+pageNum,param)
}
/** 编辑接口*/
function update(userId,param) {
    return put('/users/'+userId,param)
}
/** 修改密码*/
function resetPwd(userId,param) {
    return put('/users/'+userId+"/password",param)
}

function assignRoles(userId,param){
    return put('/users/'+userId+"/roles",param)
}
 const userApi = {
     deleteUser,
     detail,
     create,
     search,
     update,
     resetPwd,
     searchSimple,
     assignRoles
}

export default userApi
