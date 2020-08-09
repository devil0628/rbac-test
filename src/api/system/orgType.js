import {post,put,get,deleteFun} from "./../request";

/** 删除接口*/
 function deleteType(orgTypeCode) {
    return deleteFun('/orgs/types/'+orgTypeCode)
}
/** 新增接口*/
function create(param) {
    return post('/orgs/types',param)
}
/** 查询接口*/
function search(param) {
    return post('/orgs/types/condition',param)
}
/** 编辑接口，*/
function update(orgTypeCode,param) {
    return put('/orgs/types/'+orgTypeCode,param)
}

 const orgTypeApi = {
     deleteType,
     create,
     search,
     update,
}

export default orgTypeApi
