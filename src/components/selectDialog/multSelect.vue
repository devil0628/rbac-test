<template>
    <div class="mult-select">
        <div v-if="!onlyDialog">
        <el-button class="el-button--text"  type="text" @click="showDialog" v-if="!disabled">选择数据</el-button>
        <br v-if="!disabled"/>
        <el-table :data="copySelected" size="mini" border v-if="selectedShowType=='table'">
            <el-table-column v-for="(column,index) in columnLabel"  :key="index"
                             :label="column.label"
                             :prop="column.value"
            ></el-table-column>
            <el-table-column label="操作" width="55" v-if="!disabled">
                <template slot-scope="scope">
                    <el-button type="text" @click="delOneSubmit(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <el-dialog  title="选择" :visible.sync="dialogShow" :close-on-click-modal="false" :append-to-body="true">
            <el-row>
                <el-col :span="12">
                    <search-tool :conditions="searchData" @click="doSearch"></search-tool>
                    <el-table :data="tableData" size="mini" border
                              ref="multSelectTable"
                              @select="handleSelectOne"
                              @select-all="handleSelectAll" >
                        <el-table-column  type="selection"  width="55"> </el-table-column>
                        <el-table-column v-for="(column,index) in columnLabel"  :key="index"
                                         :label="column.label"
                                         :prop="column.value"
                        ></el-table-column>
                    </el-table>
                    <el-pagination v-if="isPage"
                                   @current-change="handleCurrentChangePage"
                                   :current-page="currentPage"
                                   :page-size="pageSize"
                                   layout="total, prev, pager, next"
                                   :total="total">
                    </el-pagination>
                </el-col>
                <el-col :span="11" :offset="1">
                    <div>已选择列表 <el-button size="mini"  class="ml20" @click="clearSelect">清空</el-button> </div>
                    <div style="margin-top: 15px;">
                        <el-tag class="mr5"
                                v-for="(tag,index) in copySelected"
                                :key="index"
                                @close="delOne(index)"
                                closable
                                :disable-transitions="false"
                                v-if="selectedShowType=='tag'"
                               >
                            {{showTag(tag)}}
                        </el-tag>
                        <el-table :data="copySelected" size="mini" border v-if="selectedShowType=='table'">
                            <el-table-column v-for="(column,index) in columnLabel"  :key="index"
                                             :label="column.label"
                                             :prop="column.value"
                            ></el-table-column>
                            <el-table-column label="操作" width="55">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="delOne(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitCancel">取 消</el-button>
                <el-button type="primary" @click="submitSelected">确 定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import {deepCopy,uniqueArray} from "../../common/js/utils";

    export default {
        name: "multSelect",
        props:{
            searchData:{  //用于搜索
                default:[],
                type:Array
            },
            selectedData:{
                type:Array,
                default:()=>[]
            },
            idUseEqual:{   //用于id判断
                default:null,
                type:String
            },
            isPage:{   //是否需要分页
                default:true,
                type:Boolean
            },
            apiFun:{          //api的接口请求方式
                type:Function
            },
            columnLabel:{
                type:Array,
                default:[]
            },
            selectedShowType:{
                default:"table",//table,tag
                type:String
            },
            onlyDialog:{   //只要dialog
                default:false,
                type:Boolean
            },
            disabled:{
                default:false,
                type:Boolean
            },
        },
        data(){
            return{
                dialogShow:false,
                tableData:[],
                total:0,
                pageSize:10,
                currentPage:1,
                conditonValue:{},
                copySelected:[]
            }
        },
        watch:{
            selectedData(cur,old) {
                this.copySelected = deepCopy(cur);  //深拷贝不改变地址
            }
        },
        methods:{
            showDialog(){
                this.dialogShow = true;
                this.copySelected = deepCopy(this.selectedData);  //深拷贝不改变地址
                if(this.searchData.length){
                    for(let sd of this.searchData){
                        if(sd.default){
                            this.conditonValue[sd.field] = sd.default.value;
                        }
                    }
                }
                this.doSearch(this.conditonValue);
            },
            doSearch(searchValue ={}){
                this.conditonValue = searchValue;  //暂存搜索的数据
                //接口暂时隐藏，使用静态数据
                this.apiFun(this.pageSize,this.currentPage,searchValue).then(res =>{
                    if(res.data.list){
                        this.tableData = res.data.list;
                        this.total = res.data.total;
                    }else{
                        this.tableData = res.data;
                        this.total = res.data.length;
                        this.isPage = false;
                    }
                    this.updateSelectedStatus();
                })
            },
            handleCurrentChangePage(val){
                this.currentPage = val;
                this.doSearch(this.conditonValue);
            },
            //和列表选择有关
            clearSelected(){
                this.copySelected = [];
                this.$refs.multSelectTable && this.$refs.multSelectTable.clearSelection();
            },

            handleSelectOne(sel,row){
                this.copySelected = this.copySelected || [];
                let index1 = this.copySelected.findIndex(item =>item[this.idUseEqual] ==row[this.idUseEqual]); //存在就删除,不然就push
                if(index1==-1){
                    this.copySelected.push(row);
                }else {
                    this.copySelected.splice(index1,1);
                }
            },
            handleSelectAll(sel){
                if(sel.length>0){   //全选是
                    sel.forEach(obj =>{
                        let index1 = this.copySelected.findIndex(item =>item[this.idUseEqual] ==obj[this.idUseEqual]); //存在就删除,不然就push
                        if(index1==-1){
                            this.copySelected.push(obj);
                        }
                    })
                }else {     //全选否
                    this.tableData.forEach(obj =>{
                        let index1 = this.copySelected.findIndex(item =>item[this.idUseEqual] ==obj[this.idUseEqual]); //存在就删除,不然就push
                        if(index1!=-1){
                            this.copySelected.splice(index1,1);
                        }
                    })
                }
            },
            clearSelect(){ //清空已选的数据
                this.copySelected = [];
                this.$refs.multSelectTable.clearSelection();
            },
            updateSelectedStatus(){  //更新选中的状态
                this.$refs.multSelectTable.clearSelection();
                this.$nextTick(() =>{
                    if(this.copySelected.length>0){
                        this.tableData.map(tab =>{
                            let index1 = this.copySelected.findIndex(item =>item[this.idUseEqual] ==tab[this.idUseEqual]); //存在就删除,不然就push
                            if(index1!=-1){
                                this.$refs.multSelectTable.toggleRowSelection(tab);
                            }
                        })
                    }

                })

            },
            delOne(index){
                this.$refs.multSelectTable.toggleRowSelection(this.copySelected[index]);
                this.copySelected.splice(index,1);
            },
            delOneSubmit(index){
                this.delOne(index);
                this.submitSelected();
            },
            submitSelected(){
                this.$emit('update',this.copySelected);
                this.dialogShow = false;
            },
            showTag(row){
                let str = "";
                for(let o of this.columnLabel){
                    str += row[o.value] +"/";
                }
                str = str.substring(0,str.length-1);
                return str;
            },
            submitCancel(){
                this.copySelected = deepCopy(this.selectedData);  //深拷贝不改变地址
                this.copySelected = this.copySelected||[];
                this.dialogShow = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .mr5{
        margin-right: 5px;
    }

</style>
