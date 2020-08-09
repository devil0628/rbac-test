/**
 * 判空函数
 * @param  {obj/arr/str}  检测对象
 */
function empty(obj){
    const objType = typeOf(obj)
    if(objType === "array"){
        return !obj.length>0
    } else if (objType === "object") {
        return !Object.keys(obj).length > 0
    } else if (objType === "string"){	// string
        return !(obj.trim()).length>0
    } else {
        return false
    }
}


//防抖
const Debounce = (fn, t) => {  //防抖，用的时候在function那边不要用箭头函数
    let delay = t || 500;
    let timer;
    return function () {
        let args = arguments;
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
};
/**
 * 检测传入的参数类型
 * @param obj {All}	需要进行参数检测的对象
 * @return {String} 所属类型字符串
 */
function typeOf (obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]'	 : 'boolean',
        '[object Number]' 	 : 'number',
        '[object String]' 	 : 'string',
        '[object Function]'  : 'function',
        '[object Array]' 	 : 'array',
        '[object Date]' 	 : 'date',
        '[object RegExp]'	 : 'regExp',
        '[object Undefined]' : 'undefined',
        '[object Null]' 	 : 'null',
        '[object Object]' 	 : 'object'
    };
    return map[toString.call(obj)];
}


function accessControl (to, accessStore, next) {
    console.log("有问题，需要验证菜单层级，需要验证角色层级")
    const { access = {} } = to.path || {}
    let passable = Object.keys(access).every(key => !!accessStore[key])
    if (passable) { // 可通过
        next()
    } else { // 不可通过，非法登录
        next({name: '404'})
    }
}

/**
 * 筛选出目标对象里有的字段，目标对象里没有的字段剔除
 * @param target    {Object}  目标比对对象
 * @param obj       {Object}  处理对象
 * @returns         {Object}  处理完成后的对象
 */
function objKeyFilter(target, obj) {
    const keyList = Object.keys(target)
    let ret = {}
    keyList.forEach(k => {
        ret[k] = obj[k] != null ? obj[k] : ''
    })
    return ret
}

/**
 * 深拷贝函数
 * @param target {object} 需要拷贝的目标对象
 * @returns {object} 拷贝完成的新对象
 */
function deepCopy(target) {
    const flag = typeOf(target);
    let copy;

    if (flag === 'array') {
        copy = [];
        for (var i = 0, len = target.length; i < len; i++) {
            copy.push(deepCopy(target[i]));
        }
    } else if (flag === 'object') {
        copy = {};
        for (var k in target) {
            copy[k] = deepCopy(target[k]);
        }
    } else {
        copy = target;
    }
    return copy;
}
/***
 * JSONa数组去重
 * @param arr
 * @param key 唯一的key,根据此键名去重
 */
function uniqueArray(arr, key) {
    let result = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        let item = arr[i];
        let repeat = false;
        for (let j = 0; j < result.length; j++) {
            if(key){
                if (item[key] == result[j][key]) {
                    repeat = true;
                    break;
                }
            }else {
                if (item == result[j]) {
                    repeat = true;
                    break;
                }
            }
        }
        if (!repeat) {
            result.push(item);
        }
    }
    return result;
}

// 从树形数据中递归筛选目标值
function valInDeep(arr = [], val, id, childs) {
    return arr.reduce((flat, item) => {
        return flat.concat(item[id] == val ? item : valInDeep(item[childs] || [], val, id, childs));
    }, []);
}

// 将树形数据向下递归为一维数组
function flattenDeep(arr = [], childs) {
    return arr.reduce((flat, item) => {
        return flat.concat(item, item[childs] ? flattenDeep(item[childs], childs) : [] );
    }, []);
}

// 将树形数据向上将此支线递归为一维数组
function flattenDeepParents(arr, parent) {
    return arr.reduce((flat, item) => {
        return flat.concat(item[parent] || [], item[parent] ? flattenDeepParents([item[parent]], parent) : [] );
    }, []);
}

// 根据条件递归祖先元素
function regDeepParents(row, parent, cb) {
    if(row[parent]){
        cb && cb(row[parent]);
        regDeepParents(row[parent], parent, cb);
    }
}

export {
    empty,typeOf,Debounce,accessControl,objKeyFilter,deepCopy,uniqueArray,valInDeep,flattenDeep,flattenDeepParents,regDeepParents
}
