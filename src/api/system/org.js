import {post,put,get,deleteFun} from "./../request";

/** 机构关联。 */
function related(orgId,param) {
    return post('/orgs/'+orgId+"/related",param)
}
/** 机构删除接口，同时删除机构管理员账户，以及机构关联关系*/
 function deleteOrg(orgId) {
    return deleteFun('/orgs/'+orgId)
}
/** 机构基本信息查询接口*/
function detail(orgId) {
    return get('/orgs/'+orgId)
}
/** 机构新增接口*/
function create(param) {
    return post('/orgs',param)
}
/** 机构查询接口*/
function search(pageSize,pageNum,param) {
    return post('/orgs/condition/'+pageSize+'/'+pageNum,param)
}
/** 机构编辑接口，机构类型编码和产品线不可编辑。*/
function update(orgId,param) {
    return update('/orgs/'+orgId,param)
}

 const orgApi = {
     related,
     deleteOrg,
     detail,
     create,
     search,
     update,
}

export default orgApi
