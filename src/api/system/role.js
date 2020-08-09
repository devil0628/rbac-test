import {post,put,get,deleteFun} from "./../request";

/** 删除角色关联权限。*/
function deletePerms(roleId,permsId) {
    return deleteFun('/roles/'+roleId+'/perms/'+permsId)
}
/** 删除角色关联菜单。菜单关联的权限被当前角色在其他菜单中关联时不删除，否则删除。*/
function deleteMenu(roleId,menuId) {
    return deleteFun('/roles/'+roleId+'/menus/'+menuId)
}
function deleteUser(roleId,userId) {
    return deleteFun('/roles/'+roleId+'/users/'+userId)
}
function deleteDataPerms(roleId,permId){
    return deleteFun('/roles/'+roleId+'/datas/perms/'+permId)
}

/** 角色关联功能权限查询接口*/
function searchPerms(roleId,pageSize,pageNum,param) {
    return post('/roles/'+roleId+'/functions/condition/'+pageSize+'/'+pageNum,param)
}
/** 角色关联数据权限查询接口*/
function searchDataPerms(roleId,pageSize,pageNum,param) {
    return post('/roles/'+roleId+'/datas/condition/'+pageSize+'/'+pageNum,param)
}
/** 角色关联用户查询接口*/
function searchUsers(roleId,pageSize,pageNum,param) {
    return post('/roles/'+roleId+'/users/condition/'+pageSize+'/'+pageNum,param)
}
/** 角色关联菜单查询接口*/
function searchMenus(roleId,pageSize,pageNum,param) {
    return post('/roles/'+roleId+'/menus/condition/'+pageSize+'/'+pageNum,param)
}
/** 角色分配数据数据接口，传入空数组时删除当前角色的数据权限。控制条*/
function createDataPerms(roleId,param) {
    return post('/roles/'+roleId+'/permission/datas',param)
}
/** 角色分配机构数据接口*/
function bindOrgs(roleId,param) {
    return post('/roles/'+roleId+'/orgs',param)
}
/** 角色分配权限接口*/
function bindPerms(roleId,param) {
    return post('/roles/'+roleId+'/permission/functions',param)
}
/** 角色分配菜单及权限接口*/
function bindMenus(roleId,param) {
    return post('/roles/'+roleId+'/menus',param)
}
/** 角色分配用户*/
function bindUsers(roleId,param) {
    return post('/roles/'+roleId+'/users',param)
}
/** 角色删除，删除角色和菜单、权限、机构关系数据，删除角色和用户的绑定关系，禁用用户。*/
function deleteRole(roleId) {
    return deleteFun('/roles/'+roleId)
}
/** 角色基础信息查询*/
function detail(roleId) {
    return get('/roles/'+roleId)
}
/** 角色新增，当前用户角色类型为SYSTEM时，可以新增任意类型的角色。当前用户角色为PLATFORM、TENANT、ORG、orgTypeCode 时，只能创建对应类型的角色。当前用户只能创建所属租户和机构的TENANT*/
function create(param) {
    return post('/roles',param)
}
/** 角色编辑。当前用户角色类型为SYSTEM时，可以新增任意类型的角色。当前用户角色为PLATFORM、TENANT、ORG、orgTypeCode 时，只能创建对应类型的角色。*/
function update(roleId,param) {
    return put('/roles/'+roleId,param)
}
/** 角色查询接口 */
function search(pageSize,pageNum,param) {
    return post('/roles/condition/'+pageSize+'/'+pageNum,param)
}

 const roleApi = {
     deletePerms,
     deleteMenu,
     deleteDataPerms,
     deleteUser,
     searchPerms,
     searchDataPerms,
     searchUsers,
     searchMenus,
     createDataPerms,
     bindOrgs,
     bindPerms,
     bindMenus,
     bindUsers,
     deleteRole,
     detail,
     create,
     update,
     search,
}

export default roleApi
