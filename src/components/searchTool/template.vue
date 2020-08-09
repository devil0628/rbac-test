<template>
  <div>
    <!-- <el-row class="search-tool "> -->
    <el-form class="search-tool">
      <!-- 请选择 -->
      <el-col :span="6">
        <div v-if="conditions && conditions.length > 1">
          <el-select v-model="current" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="(condition,index) in conditions"
              v-if="!condition.default"
              :key="index"
              :label="condition.label"
              :value="condition.field"
            ></el-option>
          </el-select>
        </div>
      </el-col>

      <!-- 输入框 -->
      <el-col
        :span="(condition.date && condition.date.type.endsWith('range'))?10:condition.address?12:8"
        v-for="(condition,index) in conditions"
        :key="index"
        class="query-key-enter"
      >
        <div class="search-item" v-show="isShowThisItem(condition.field)" v-if="condition.input">
          <el-input v-model.trim="values[condition.field]" :placeholder="condition.label" v-if="!condition.input.disabled"/>
        </div>
        <div class="search-item" v-show="isShowThisItem(condition.field)" v-if="condition.select">
          <el-select
            v-model="values[condition.field]"
            :multiple="condition.select.multi"
            :placeholder="condition.label"
          >
            <el-option
              v-for="(item,index) in condition.select.items"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-item" v-show="isShowThisItem(condition.field)" v-if="condition.date">
          <el-date-picker
            v-model="values[condition.field]"
            :type="condition.date.type"
            :placeholder="condition.label"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
          />
        </div>

      </el-col>

      <!-- 搜索 -->
      <el-col :span="2" v-show="showSearchButton" style="margin-bottom: 8px">
        <el-button class="lightGreenBtn" @click="doSearch" >搜索</el-button>
      </el-col>
      <!-- 搜索条件 -->
      <el-col :span="24" >
          <el-tag v-for="(tag,index) in tags" :key="index" size="small" class="tag"
                  :closable="!tag.default"
                  @close="tagClose(tag)">
              {{tag.cons.label}}&nbsp;:&nbsp;{{tag.label}}
        <!-- <span v-if="labelVal!='serviceCenterLocation'"></span>
        <span v-else>{{inputAddress}}</span> -->
        </el-tag>
      </el-col>
    </el-form>
    <!-- </el-row> -->


  </div>
</template>

<script>
import common from "common/js/common.js";

export default {

  props: ["conditions"],
  data() {
    return {
      current: "",
      showSearchButton: false,
      values: {},
      tags: [],
      inputAddress: null,
      options:[],//地图搜索返回结果
      labelVal: ""
    };
  },
  watch: {
    current(cur, old) {
      if (cur) {
        this.showSearchButton = true;
      } else {
        this.showSearchButton = false;
      }
    },
    conditions(cur) {
        this.init();
    }
  },
  methods: {
    // 搜索label改变
    selectChange(val) {
      this.labelVal= val;
    },

    doSearch() {
      //更新搜索值
      var index = this.tags.findIndex(t => {
        return t.cons.field == this.current;
      });
      if (index != -1) {
        this.tags.splice(index, 1);
      }
      let tempv = common.cleanObject(this.values[this.current]);

      //add tags
      let isHasValue = false;
      if (common.isString(tempv) || Number.isInteger(tempv)) {
        if (tempv || tempv === 0) {
          isHasValue = true;
        }
      } else {
        for (let vi in tempv) {
          if (tempv[vi] || tempv[vi] === 0) {
            isHasValue = true;
          }
        }
        if (typeof tempv === "object") {
          if (tempv.constructor && tempv.constructor.name == "Date") {
            isHasValue = true;
          }
        }
      }
      if (isHasValue) {
        let cons = this.getCondition(this.current);
        this.addSearchTag(cons, tempv);
      }
      this.sendSearchValues(false);
    },
    addSearchTag(cons, value) {
      let stv = this.showTagValue(cons, value);
      // if(this.labelVal=='serviceCenterLocation') {
      //   return;
      // }
      if (stv != undefined && stv != "") {
        this.tags.push({
          cons: cons,
          value: value,
          label: stv
        });
      }
    },
    isShowThisItem(field) {
      return this.current == field;
    },
    getCondition(field) {
      for (var con in this.conditions) {
        if (this.conditions[con].field == field) {
          return this.conditions[con];
        }
      }
    },
    tagClose(tag) {
      //清理标签
      var index = this.tags.findIndex(t => {
        return t.cons.field == tag.cons.field;
      });
      if (index != -1) {
        this.tags.splice(index, 1);
      }
      //清理搜索框
      if (this.values[tag.cons.field]) {
        if (common.isString(this.values[tag.cons.field])) {
          this.values[tag.cons.field] = "";
        } else {
          this.values[tag.cons.field] = [];
        }
      }
      //触发搜索
      this.sendSearchValues(true);
    },
    showTagValue(cons, value) {
      if (cons.input) {
        return value;
      } else if (cons.select) {
        let select = cons.select;
        if (select.multi) {
          let itemstr = "";
          for (var item in select.items) {
            for (var v in value) {
              if (value[v] == select.items[item].value) {
                itemstr += select.items[item].label + ",";
              }
            }
          }
          return itemstr;
        } else {
          let index = select.items.findIndex(item => {
            return item.value == value;
          });
          return select.items[index].label;
        }
      } else if (cons.date) {
        if (cons.date.type == "daterange") {
          return (
            common.formatDate(value[0]) + " - " + common.formatDate(value[1])
          );
        } else if (cons.date.type == "datetimerange") {
          return (
            common.formatDateTime(value[0]) +
            " - " +
            common.formatDateTime(value[1])
          );
        } else if (cons.date.type == "month") {
          return common.formatMonth(value);
        } else {
          return common.formatDate(value);
        }
      }

    },
    sendSearchValues(isClose) {
      var tempv = {};
      if (this.tags) {
        for (var i in this.tags) {
          tempv[this.tags[i].cons.field] = common.cleanObject(
            this.tags[i].value
          );
        }
      }
      this.$emit("click", tempv, isClose);
    },
    doClear() {
        let ntags = [];
        for(let t of this.tags){
            t.default && ntags.push(t);
        }
      this.tags = ntags;
      for (let vi in this.values) {
        if (typeof vi == "object" && vi.length>=0) {
          this.values[vi] = [];
        } else if (typeof vi == "object") {
            this.values[vi] = {};
        } else {
          this.values[vi] = "";
        }
      }
    },
    init() {
      let isHasCascader = false;
      let isLocation = false;
      for (let ind in this.conditions) {
        if (this.conditions[ind]["cascader"]) {
          if(this.conditions[ind]["cascader"].support_para){
            this.support_para= true;
          }
          isHasCascader = true;
          break;
        }
      }
      isHasCascader && this.getGradeList();

      //默认第一个显示
      if (this.conditions && this.conditions.length) {
        this.current = this.conditions[0].field;
      }

      //默认搜索条件
        this.tags = [];
      if (this.conditions) {
        for (let coni in this.conditions) {
          if (this.conditions[coni].default) {
              this.tags.push({
                  cons: this.conditions[coni],
                  value: this.conditions[coni].default.value,
                  label: this.conditions[coni].default.label,
                  default:true
              });
          }
        }
        if (this.tags && this.tags.length > 0) {
          //this.sendSearchValues(false);
        }
      }

      //enter
      let self = this;
      $(".query-key-enter").keyup(function(e) {
        if (e.keyCode == 13) {
          self.doSearch();
        }
      });
    },

    // 关闭地图弹窗
    closeMoule(val){
      this.mapDialog = false;
      if(val) {
        this.condition.serviceCenterLocation = val.addressLocation;
      }
    },
    //地图弹框-选中下拉框中的值
    selectAdressOptions(selVal){
      if(selVal==='') {
        this.$message.error('该地址无经纬度，请重新选择');
        return
      }
      let item = this.options.find(item => {
        return item.id == selVal;
      });
      this.mapItem = item;
      //this.inputAddress= item.label;
      this.map.setCenter([item.location.lng, item.location.lat]); //设置地图中心点
      this.setMarker([item.location.lng, item.location.lat]);
    },
    // 取消
    cancelMap() {
      this.mapDialog = false;
      this.inputAddress='';
      this.options = [];
    },
    //地图弹框-提交
    submitSelectAddress(){
      let item = this.options.find(item => {
        return item.id == this.inputAddress;
      });
      let inputAddress= "";
      inputAddress = item.district + item.name;
      this.values['serviceCenterLocation']= inputAddress;
      let addressLocation="";
      addressLocation= item.location.lng + ',' + item.location.lat;
      this.values['serviceCenterLocation']= addressLocation;
      this.doSearch();
      this.mapDialog = false;
    },
    //地图弹框-显示地图+自动定位
    showMap() {
      let that = this;
      this.map = new AMap.Map('chooseScope', {
        resizeEnable: true
      });
      AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition:'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        });
        that.map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status,result){
          if(status=='complete'){
            console.log("浏览器定位成功");
          }else{
            console.log("浏览器定位失败");
          }
        });
      });
      this.map.on('click', function(e) {

      });
    },
    //地图弹框-地址模糊搜索
    remoteMethod(query) {
      let that = this;
      if (query == ''){
        that.options = [];
        that.inputAddress = "";
        return true;
      }
      AMap.plugin('AMap.Autocomplete', function(){
        // 实例化Autocomplete
        var autoOptions = {
          city: '全国'
        }
        var autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(query, function(status, result) {
          let list = result.tips;
          if(list){
            list.forEach(function(val,index,arr) {
              if(val.id=='') {
                list.splice(index,1);
              }
            })
            that.options = [];
            list.map(item => {
              item.value = item.id;
              item.label = item.district + item.address + item.name;
              return item;
            });
              that.options = list;
          }
        })
      })
    },
    // 画圆
    setMarker(lnglat) {
      // 添加圆图形
      if(lnglat) {
        // 创建一个 Marker 实例：
        var marker = new AMap.Marker({
          position: lnglat,//new AMap.LngLat(lng, lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });
        // 将创建的点标记添加到已有的地图实例：
        this.map.add(marker);
      }
    }
  },
  mounted: function() {
    this.init();
  }
};
</script>

<style>
.search-tool .el-input {
  width: 100%;
}
.search-tool .el-col {
  margin-right: 5px;
}
.search-tool .region-group .el-col {
  margin-right: 0;
}
.search-tool .el-tag {
  margin: 0 5px 4px 0px;

}
</style>
<style scoped>
  .mapDialog{
    height: 400px;
  }
</style>
