import {post,put,get,deleteFun} from "./../request";


function getMenuData(pageSize,pageNum,param) {  //获取表格数据
    param = param || {};
    param._ranges = true;
    param._permissions = false;
    param._terminals = true;
    return post('/menus/condition/'+pageSize+'/'+pageNum,param)
}

function searchMenusAddPerms(pageSize,pageNum,param) {  //获取表格数据
    param = param || {};
    param._ranges = false;
    param._permissions = true;
    param._terminals = true;
    return post('/menus/condition/'+pageSize+'/'+pageNum,param)
}
function searchSimple(pageSize,pageNum,param) {  //获取表格数据
    return post('/menus/condition/simple/'+pageSize+'/'+pageNum,param)
}

function addMenu(param) {   //新增
    return post('/menus',param)
}
function editMenu(menuId,param) {   //编辑
    return put('/menus/'+menuId,param)
}
function getMenuById(menuId) {   //id查询基本信息
    return get('/menus/'+menuId)
}
function delMenuById(menuId) {   //id进行删除
    return deleteFun('/menus/'+menuId)
}
function updateUserRange(menuId,param) {
    return post('/menus/'+menuId+'/userange',param)
}
function assignPerms(menuId,param) {
    return post('/menus/'+menuId+'/permission/functions',param)
}

 const menuApi = {
    getMenuData,
    addMenu,
    editMenu,
    getMenuById,
    delMenuById,
    updateUserRange,
     assignPerms,
     searchSimple,
     searchMenusAddPerms
}

export default menuApi
