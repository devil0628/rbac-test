import {post,put,get,deleteFun} from "./../request";

/** 删除接口*/
 function deleteProduct(prodCode) {
    return deleteFun('/products/'+prodCode)
}
/** 新增接口*/
function create(param) {
    return post('/products',param)
}
/** 查询接口*/
function search(param) {
    return post('/products/condition',param)
}
/** 编辑接口，*/
function update(prodCode,param) {
    return put('/products/'+prodCode,param)
}

/** 删除接口*/
function deleteTerminal(prodCode) {
    return deleteFun('/products/terminals/'+prodCode)
}
/** 新增接口*/
function createTerminal(param) {
    return post('/products/terminals',param)
}
/** 查询接口*/
function terminals() {
    return get('/products/terminals')
}
function searchTerminals(param) {
    return post('/products/terminals/condition',param)
}
/** 编辑接口，*/
function updateTerminal(prodCode,param) {
    return put('/products/terminals/'+prodCode,param)
}

 const productApi = {
     deleteFun,
     create,
     search,
     update,
     deleteTerminal,
     createTerminal,
     terminals,
     searchTerminals,
     updateTerminal
}

export default productApi
