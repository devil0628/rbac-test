export default {
    /**
     * 获取时间
     *
     * 返回时间格式为‘2017-10-10 00:00:00’
     */
    formatDateTime(da) {
        if(!da){
            return "";
        }
        let date = new Date(da)
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+seconds;
    },
    /**
     * 获取时刻
     *
     * 返回时间格式为‘00:00:00’
     */
    formatTime(da) {
        let date = new Date(da);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        return h+':'+minute+':'+seconds;
    },
    /**
     * 获取时刻
     *
     * 返回时间格式为‘1970-01-01 00:00:00’
     */
    formatTime1970(da) {
        let date = new Date(da);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        return '1970-01-01'+' '+h+':'+minute+':'+seconds;
    },

    /**
     * 获取时间
     *
     * 返回时间格式为‘2017-10-10’
     */
    formatDate(da) {
        let date = new Date(da);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    },
    formatMonth(da) {
        let date = new Date(da);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        return y + '-' + m;
    },
    /**
     * 获取日期
     *
     * 返回日期格式为‘1月1日周一’
     */
    formatDateWeek(da) {
        let date = new Date(da);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let a = new Array("日", "一", "二", "三", "四", "五", "六");
        let week = new Date(da).getDay();
        let w = a[week];
        return  m + '月' + d+ '日'+ '(周'+ w+ ')';
    },
    /**
     * bedlist格式转化
     */
    changeBedList(bedList){
        if(bedList.length!==0){
            for(var i=0;i<bedList.length;i++) {
                bedList[i].label = bedList[i].blName;
                bedList[i].value = bedList[i].blId;
                // building foreach
                var floors = bedList[i].children;
                if(floors.length !== 0){
                    for(var j=0;j<floors.length;j++){
                        // floor foreach
                        floors[j].label = floors[j].flName;
                        floors[j].value = floors[j].flId;
                        delete floors[j].blId;
                        var rooms = floors[j].children;
                        if(rooms.length !== 0) {
                            for(var k=0;k<rooms.length;k++){
                                // room foreach
                                rooms[k].label = rooms[k].rmName;
                                rooms[k].value = rooms[k].rmId;
                                delete rooms[k].flId;
                                var beds = rooms[k].children;
                                if(beds.length!=0){
                                    for(var n=0;n<beds.length;n++){
                                        beds[n].label = beds[n].bedNo;
                                        beds[n].value = beds[n].bedId;
                                        delete beds[n].rmId;
                                    }
                                }else{
                                    delete rooms[k].children;
                                }
                            }
                        }else{
                            delete floors[j].children;
                        }
                    }
                }else{
                    delete bedList[i].children;
                }
            }};
        return bedList;
    },

    /**
     * 获取当前日期
     *
     * 返回格式为yyyy-mm-dd的日期，如：2014-01-25
     */
    getCurrentDate(){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var Month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        return year+"-"+(Month<10?"0"+Month:Month)+"-"+(day<10?"0"+day:day);
    },

    /**
     * 获取当前日期
     *
     * 返回格式为yyyy/mm/dd的日期，如：2014/01/25号
     */
    getCurrentDateTime(){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var Month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var week = this.getCurrentWeek();
        return year+"/"+(Month<10?"0"+Month:Month)+"/"+(day<10?"0"+day:day)+'号('+week+')';
    },

    /**
     * 获取当前是周几
     *例如:周一
     */
    getCurrentWeek(){
        var str = "";
        var week = new Date().getDay();
        if (week == 0) {
            str = "周日";
        } else if (week == 1) {
            str = "周一";
        } else if (week == 2) {
            str = "周二";
        } else if (week == 3) {
            str = "周三";
        } else if (week == 4) {
            str = "周四";
        } else if (week == 5) {
            str = "周五";
        } else if (week == 6) {
            str = "周六";
        }
        return str;
    },

    /**
     * 获取上一个月
     *
     * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
     */
    getPreMonth(date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {//如果是1月份，则取上一年的12月份
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
        if (month2 < 10) {
            month2 = '0' + month2;//月份填补成2位。
        }
        var t2 = year2 + '-' + month2;
        return t2;
    },

    /**
     * 将日期转化为10/10
     *
     * @date 格式为2017-10-10 00:00:00
     */
    formateDateToTime(date){
        let newDate = date.replace(/\-/g, '/');
        return newDate.substring(5, 10);
    },
    /**
     * 将多个时间段[["h+':'+minute","h+':'+minute"]]转化为一个字符串
     *
     * @date 格式为string = "h+':'+minute","h+':'+minute"
     */
    formateTimeToString(dateList){
        let dateStringLise = [];
        let dateString;
        for(let date of dateList){
            // date[0] = this.formatTime(date[0]);
            // date[1] = this.formatTime(date[1]);
            dateString = date[0]+"-"+ date[1];
            dateStringLise.push(dateString);
        }
        return dateStringLise.join(" , ");
    },
    /**
     * 将多个时间段[["h+':'+minute","h+':'+minute"]]转化为一个字符串
     *
     * @date 格式为string = "h+':'+minute","h+':'+minute"
     */
    formateTimeToString2(dateList){
        let dateStringLise = [];
        let dateString;
        for(let date of dateList){
            date[0] = this.formatTime(date[0]);
            date[1] = this.formatTime(date[1]);
            dateString = date[0]+"-"+ date[1];
            dateStringLise.push(dateString);
        }
        return dateStringLise.join(" , ");
    },
    /**@times时间格式：[["09:40:00","11:40:00"],["12:40:00","14:40:00"],["15:40:00","16:40:00"]];
     * 将后台的时间格式转成[[标准时间,标准时间],[标准时间,标准时间]]
     *@timeArr时间格式:[ [ "2017-08-29T09:34:27.000Z", "2017-08-29T10:34:27.000Z" ], [ "2017-08-29T09:34:30.000Z", "2017-08-29T10:36:30.000Z" ] ]
     */
    formateTimeToArr(times){
        let timeArr=[];
        for(let time of times){
            time[0] = new Date(1970,1,1,time[0].substring(0,2),time[0].substring(3,5),time[0].substring(6,8));
            time[1] = new Date(1970,1,1,time[1].substring(0,2),time[1].substring(3,5),time[1].substring(6,8));
            timeArr.push(time);
        }
        return timeArr;
    },

    /**
     * 身份证验证合法性
     *
     */
    validateCardno(rule, value, callback){
        var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
        var iSum=0 ;
        var info="" ;
        var status = true;
        if(!/^\d{17}(\d|x)$/i.test(value)){
            status = false;
            callback(new Error('你输入的身份证长度或格式错误'));
        }
        if(status){
            value=value.replace(/x$/i,"a");
            if(aCity[parseInt(value.substr(0,2))]==null){
                callback(new Error('你输入的身份证中地区非法'));
            }
            var sBirthday=value.substr(6,4)+"-"+Number(value.substr(10,2))+"-"+Number(value.substr(12,2));
            var d=new Date(sBirthday.replace(/-/g,"/")) ;
            if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
                callback(new Error('你输入身份证中出生日期非法'));
            }
            for(var i = 17;i>=0;i --){
                iSum += (Math.pow(2,i) % 11) * parseInt(value.charAt(17 - i),11);
            }
            if(iSum%11!=1){
                callback(new Error('你输入的身份证号非法'));
            }
        }
        callback();
    },

    /**
     * 手机号码正则表达式验证
     *
     */
    checkPhone(phone){
        let reg = /^1[0-9]{10}$/;
        let flag = reg.test(phone);
        return flag;
    },
    /**
     * 邮箱校验
     */
    checkEmail(rule, value, callback){
        let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(value){
            let flag = reg.test(value);
            if(!flag){
                callback(new Error('邮箱格式有误'));
            }
        }
        callback();
    },

    /**
     * 手机号码正则表达式验证
     *
     */
    validatePhone(rule, value, callback){

        let reg = /^1[0-9]{10}$/;
        let flag = reg.test(value);
        if(!flag){
            callback(new Error('你输入的手机号码长度或格式错误'));
        }
        callback();
    },
    /**
     * 银行卡号的验证
     * @param rule
     * @param value
     * @param callback
     */
    validateBankcard(rule, value, callback){
        let reg = /^([1-9]{1})(\d{14}|\d{18})$/;
        if(value == ''||value == null){
            callback();
        }
        let flag = reg.test(value);
        if(!flag){
            callback(new Error('你输入的银行卡号长度或格式有误'));
        }
        callback();
    },

    validateEmNo(rule, value, callback){

        if(value == null){
            callback(new Error('你输入的工号为非字母数字组合'));
        }
        let reg = /^[0-9a-zA-Z]+$/;
        let flag = reg.test(value);
        if(!flag){
            callback(new Error('你输入的工号为非字母数字组合'));
        }
        callback();
    },

    /**
     * 整数验证
     */
    checkNum(rule, value, callback){
        let reg = /^\d+$/;
        if (!reg.test(value)) {
            callback(new Error('请输入整数值'));
        }else{
            callback();
        }
    },
    /**
     * 正整数校验(0)
     */
    isPositiveInteger(rule, value, callback){
        let reg = /^[0-9]+$/;
        if (!reg.test(value)) {
            callback(new Error('请输入正整数'));
        }else{
            callback();
        }
    },
    /**
     * 正整数校验(不含0)
     */
    isGTZeoroInteger(rule, value, callback){
        let reg = /^[1-9]\d*$/;
        if (!reg.test(value)) {
            callback(new Error('请输入大于0的整数'));
        }else{
            callback();
        }
    },

    /**
     * 百分比验证 0-100可有小数
     */
    checkPercent(rule, value, callback){
        let reg = /(^\d{1,2}$)|(^\d{1,2}\.\d{1,4}$)/;
        if (!reg.test(value)) {
            callback(new Error('请输入[0,100)内的数字(最多四位小数)'));
        }else{
            callback();
        }
    },
    /**
     * 1-31之间的数字
     */
    checkDay(rule, value, callback){
        let reg = /^([1-9]|[12][0-9]|30|31)$/;
        if (!reg.test(value)) {
            callback(new Error('请输入1-31内的数字'));
        }else{
            callback();
        }
    },

    /**
     * 金额验证
     */
    checkMoney(rule, value, callback){
        if(value !=''){
            let reg = /(^[1-9]([0-9]{0,5})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value) || Number(value)==0) {
                callback(new Error('金额的输入格式不正确,请输入99999.99以内金额'));
            }else{
                callback();
            }
        } else {
            callback();
        }
    },
    /**
     * 拷贝对象，去掉vue关系
     */
    cleanObject(obj){
        if(typeof obj==='object'){
            if(obj.constructor && obj.constructor.name == 'Date'){
                return obj;
            }else{
                return Object.assign({},obj);
            }
        }else{
            return obj;
        }
    },
    isString(obj){
        if(typeof obj === 'string'){
            return true;
        }else{
            return false;
        }
    },
    /**
     */
    isInArray(arr, val){
        var i, iLen;
        if(!(arr instanceof Array) || arr.length === 0){
            return false;
        }
        if(typeof Array.prototype.indexOf === 'function'){
            return !!~arr.indexOf(val)
        }
        for(i = 0, iLen = arr.length; i < iLen; i++){
            if(val == arr[i]){
                return true;
            }
        }
        return false;
    },
    download(url){
        let aTag = window.document.createElement('a');
        //aTag.download = file.name;
        aTag.href = url;
        aTag.click();
    },
    /**
     * 下载
     * @param  {String} url 目标文件地址
     * @param  {String} filename 想要保存的文件名称
     */
    downloadAndResetFilename(url, filename){
        /**
         * 获取 blob
         * @param  {String} url 目标文件地址
         * @return {Promise}
         */
        function getBlob(url) {
            return new Promise(resolve => {
                const xhr = new XMLHttpRequest();

                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    }
                };

                xhr.send();
            });
        }

        /**
         * 保存
         * @param  {Blob} blob
         * @param  {String} filename 想要保存的文件名称
         */
        function saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                const link = document.createElement('a');
                const body = document.querySelector('body');

                link.href = window.URL.createObjectURL(blob);
                link.download = filename;

                // fix Firefox
                link.style.display = 'none';
                body.appendChild(link);

                link.click();
                body.removeChild(link);

                window.URL.revokeObjectURL(link.href);
            }
        }
        getBlob(url).then(blob => {
            saveAs(blob, filename);
        });
    },
    checkSecondNum(rule, value, callback){
        let reg = /^[1-9]\d*$/;
        let flag = reg.test(value);
        if (!flag || value>100) {
            callback(new Error('请输入1-100正整数'));
            return;
        }
        callback();
    },
    checkThirdNum(rule, value, callback){
        let reg = /^[1-9]\d*$/
        let flag = reg.test(value);
        if (!flag || value>1000) {
            callback(new Error('请输入1-1000正整数'));
            return;
        }
        callback();
    },
    checkNineNum(rule, value, callback){
        let reg = /^[1-9]\d*$/
        let flag = reg.test(value);
        if (!flag || value>100000000) {
            callback(new Error('请输入1-100000000正整数'));
            return;
        }
        callback();
    },
}


