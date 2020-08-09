let baseUrl = 'http://10.32.68.18:80';
//let baseUrl = 'https://dli.xikang.com/pension';
//http://localhost:8081/#/manage#access_token=e0eae019e7d83094233501cefb508b1a&token_type=Bearer&expires_in=604800&refresh_token=89c7f8c2c1f89dfc0517dd9d25e8058e


if(typeof(window) == "undefined"){

}else {
    if(window.location.href.indexOf("127.0.0.1")>0 || window.location.href.indexOf("localhost")>0){
        //本地开发环境
        //不做处理，用默认配置
    }else{
        //发布环境
        let domain = window.location.href.split("/rbac")[0];
        baseUrl = domain
    }
}

/** 业务线终端编码*/
const PROD_TERMINAL_CODE = "YHLPC";
//打包之后本地启动 http-server

//页面定义一些静态的变量
const ROLE_TYPE ={
    SYSTEM:{key:"SYSTEM",value:1,home:"/system/home"},//系统
    PLATFORM:{key:"PLATFORM",value:10,home:"/platform/home"},//平台
    TENANT:{key:"TENANT",value:20,home:"/tenant/home"},//租户
    ORG:{key:"ORG",value:30,home:"/org/home"},//机构
    ORG_TYPE:{key:"ORG_TYPE",value:40,home:"/org-group/home"},//机构组
    USER:{key:"USER",value:50,home:"/org/home"},//用户
    compareRole(roleA,roleB){  //0相等，1 A>B , -1 A<B
        roleA = ROLE_TYPE.getRoleObject(roleA);
        roleB = ROLE_TYPE.getRoleObject(roleB);
        if(roleA.value==roleB.value){
            return 0;
        }else if(roleA.value>roleB.value){
            return 1;
        }else{
            return -1;
        }
    },
    getRoleObject(roleA){
        if(typeof roleA == "string"){
            for(let r in ROLE_TYPE){
                if(r == roleA){
                    return ROLE_TYPE[r];
                }
            }
            return ROLE_TYPE.USER;
        }else{
            return roleA;
        }
    }
};

export {
    baseUrl,ROLE_TYPE

}
