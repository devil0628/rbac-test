
//import {baseUrl} from '../common/js/config'
const baseUrl = 'http://10.32.68.15:80'
import Message from "element-ui/packages/message/src/main";

//留作拦截器，不过老项目的很多地方都进行状态判断，存在200,500，2003等状态码需要处理




export const responseHandler = res => {
    let originData = res.data || {};
    return new Promise(((resolve, reject) => {
        if(originData .status==200){
            resolve(originData);
        }else if(originData .status==401){// token问题
            window.location = baseUrl+'/rbac/login'
        }else if(originData .status==403){// 无访问权限
            alert("没有访问权限");
        } else {
            /*if(typeof originData.data.msg == 'object'){
                let msgs = originData.message;
                for(let m of originData.data.msg ){
                    msgs += "\n"+m
                }
                Vue.prototype.$message.error(msgs);
            }else if(originData.data.msg){
                Vue.prototype.$message.error(originData.data.msg);
            }else if(originData.message){
                Vue.prototype.$message.error(originData.message);
            }*/
           // reject(originData);
            Message.error(originData.message);
        }
    }))

/*    if (originData.hasOwnProperty('data') ) {  //错误统一处理
        // 格式1：{ result: ok, code: 0, data: <any> }
        return new Promise((resolve, reject) => {
            if (originData.status === 200) {
                resolve(originData.data);
            } else if (originData.code === '') {   //可以用于判断2003等其他状态码
                resolve(originData.data);
            } else {
                reject(originData); //返回整个错误体
            }
        });
    } */
};



