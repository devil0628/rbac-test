<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增产品线</el-button>
            </div>
        </div>
        <el-row>
            <el-table :data="tableData" ref="productTable" :row-key="getRowKeys" :expand-row-keys="expands">
                <el-table-column prop="operation" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="text" @click.stop="showEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click.stop="deleteOne(scope.row)">删除</el-button>
                        <el-button type="text" @click.stop="addTerminal(scope.row)">新增终端</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table :data="props.row.terminals" border size="mini">
                            <el-table-column prop="operation" label="操作" width="200px">
                                <template slot-scope="scope">
                                    <el-button type="text" @click.stop="editTerminal(props.row,scope.row)">编辑</el-button>
                                    <el-button type="text" @click.stop="deleteTerminal(props.row,scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="终端编码" prop="prodTCode"></el-table-column>
                            <el-table-column label="终端" prop="prodTName"></el-table-column>
                            <el-table-column label="终端类型" prop="prodTType">
                                <template slot-scope="scope">{{scope.row.prodTType | terminalTypeFilter}}</template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="产品线编码" prop="prodCode"></el-table-column>
                <el-table-column label="产品线" prop="prodName"></el-table-column>
            </el-table>
        </el-row>
        <!-- 编辑页 -->
        <el-drawer :visible.sync="drawerEdit" :with-header="false"  size="40%">
            <div class="flex-between p20">
                <span>{{isEdit?"修改产品线":"新增产品线"}}</span>
                <span><i class="el-icon-close" @click="drawerEdit=false"></i></span>
            </div>
            <el-form :model="perm" :rules="rules" ref="perm" label-width="100px">
                <el-form-item label="产品线编码" prop="prodCode">
                    <el-input v-model="perm.prodCode" placeholder="请输入产品线编码" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="产品线" prop="prodName">
                    <el-input v-model="perm.prodName" placeholder="请输入产品线" ></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="cancelEdit()" >取消</el-button>
                    <el-button @click.native.prevent="submitEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <!-- 编辑页 -->
        <el-drawer :visible.sync="drawerTerminalEdit" :with-header="false">
            <div class="flex-between p20">
                <span>{{isEdit?"修改产品线终端":"新增产品线终端"}}</span>
                <span><i class="el-icon-close" @click="drawerTerminalEdit=false"></i></span>
            </div>
            <el-form :model="terminal" :rules="terminalRules" ref="terminal" label-width="100px">
                <el-form-item label="产品线" prop="prodName">
                    <el-input v-model="terminal.prodName" placeholder="请输入产品线" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="终端编码" prop="prodTCode">
                    <el-input v-model="terminal.prodTCode" placeholder="请输入终端编码" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="终端" prop="prodTName">
                    <el-input v-model="terminal.prodTName" placeholder="请输入终端" ></el-input>
                </el-form-item>
                <el-form-item label="终端类型" prop="prodTType">
                    <el-select v-model="terminal.prodTType" placeholder="请输入终端类型">
                        <el-option v-for="item in terminalTypes" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="drawerTerminalEdit=false" >取消</el-button>
                    <el-button @click.native.prevent="submitTerminalEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import productApi from '../../api/system/product';
    import {Debounce} from "../../common/js/utils";

    //0PC，1APP，2微信小程序，3支付宝小程序，4H5页面
    const terminalTypes = [
        {label:"PC",value:0},
        {label:"APP",value:1},
        {label:"微信小程序",value:2},
        {label:"支付宝小程序",value:3},
        {label:"H5",value:4}
    ];
    export default {
        name: "system-product",
        data(){
            return{
                terminalTypes,
                drawerEdit:false,//编辑页
                drawerTerminalEdit:false,
                tableData:[],// 列表数据
                data:[],
                searchConditions:[// 搜索条件
                    {field: "prodCode",label: "产品线编码",input:{}},
                    {field: "prodName",label: "产品线",input:{}},
                    //{field: "prodTCode",label: "终端编码",input:{}},
                    //{field: "prodTName",label: "终端名称",input:{}},
                   // {field: "prodTType",label: "终端类型",select:{multi:false,items:terminalTypes}},
                ],
                perm:{
                    prodCode:"",
                    prodName:"",
                },
                rules: {
                    prodCode: [ {required: true, message: '请输入产品线编码', trigger: 'blur'},],
                    prodName: [ {required: true, message: '请输入产品线名称', trigger: 'blur'},],
                },
                terminal:{
                    prodCode:"",
                    prodName:"",
                    prodTCode:"",
                    prodTName:"",
                    prodTType:"0"
                },
                terminalRules: {
                    prodCode: [ {required: true, message: '请输入产品线编码', trigger: 'blur'},],
                    prodName: [ {required: true, message: '请输入产品线名称', trigger: 'blur'},],
                    prodTCode: [ {required: true, message: '请输入终端编码', trigger: 'blur'},],
                    prodTName: [ {required: true, message: '请输入终端名称', trigger: 'blur'},],
                    prodTType: [ {required: true, message: '请输入终端类型', trigger: 'blur'},],
                },
                searchValue:{},
                isEdit:false,
                nowRow:{},
                // 获取row的key值
                getRowKeys(row) {
                    return row.prodCode;
                },
                // 要展开的行，数值的元素是row的key值
                expands: [],
            }
        },
        mounted() {
            this.getProductTerminals();
        },
        methods:{
            getProductTerminals(row){
                let that = this;
                productApi.terminals().then(res=> {
                    that.data = [];
                    if (res.data) {
                        that.data= res.data;
                    }

                    that.doSearch(that.searchValue);

                    if (row && row.prodCode) {
                        this.expands = [];
                        this.expands.push(row.prodCode);
                    }
                });
            },
            doSearch(searchValue){
                this.searchValue = searchValue;
                this.tableData = this.data.filter(row => {
                    if(searchValue.prodCode){
                        if(row.prodCode.indexOf(searchValue.prodCode)<0){
                            return false;
                        }
                    }
                    if(searchValue.prodName){
                        if(row.prodName.indexOf(searchValue.prodName)<0){
                            return false;
                        }
                    }
                    return true;
                });
            },
            showDrawerAdd(){
                this.drawerEdit = true;
                this.isEdit = false;
                this.$refs['perm'] && this.$refs['perm'].clearValidate();
                this.perm = {
                    prodCode:"",
                    prodName:"",
                };
            },
            showEdit(perm){
                this.drawerEdit = true;
                this.isEdit = true;
                this.$refs['perm'] && this.$refs['perm'].clearValidate();
                 this.perm = {
                    prodCode:perm.prodCode,
                    prodName:perm.prodName,
                };
            },
            deleteOne(perm){
                let self = this;
                self.$confirm('您确认要删除?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    productApi.deleteFun(perm.prodCode).then(res=>{
                        self.$message({
                            message: '删除成功!',
                            type: 'success'
                        });
                        self.getProductTerminals();
                    })
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            submitEdit:Debounce(function () {
                let self = this
                self.$refs['perm'].validate((valid) => {
                    if (valid) {
                        productApi.create(this.perm).then(res => {
                            if (res.status == 200) {
                                self.$message.success((self.isEdit ? '修改' : '添加') + '成功' );
                                this.drawerEdit = false;
                                self.getProductTerminals();
                            } else {
                                res.message && self.$message.error(res.message);
                            }
                        });
                    }
                });
            },1000),
            cancelEdit(){
                this.drawerEdit = false;
            },
            addTerminal(prod){
                this.drawerTerminalEdit = true;
                this.isEdit = false;
                this.$refs['terminal'] && this.$refs['terminal'].clearValidate();
                this.terminal = {
                    prodCode:prod.prodCode,
                    prodName:prod.prodName,
                    prodTCode:"",
                    prodTName:"",
                    prodTType:0
                };
                this.nowRow = prod;
            },
            editTerminal(prod,terminal){
                this.drawerTerminalEdit = true;
                this.isEdit = true;
                this.$refs['terminal'] && this.$refs['terminal'].clearValidate();
                this.terminal = {
                    prodCode:prod.prodCode,
                    prodName:prod.prodName,
                    prodTCode:terminal.prodTCode,
                    prodTName:terminal.prodTName,
                    prodTType:Number.parseInt(terminal.prodTType)
                };
                this.nowRow = prod;
            },
            submitTerminalEdit:Debounce(function () {
                let self = this
                self.$refs['terminal'].validate((valid) => {
                    if (valid) {
                        productApi.createTerminal(this.terminal).then(res => {
                            if (res.status == 200) {
                                self.$message.success((self.isEdit ? '修改' : '添加') + '成功');
                                this.drawerTerminalEdit = false;
                                self.getProductTerminals(this.nowRow);
                            } else {
                                res.message && self.$message.error(res.message);
                            }
                        });
                    }
                });
            },1000),
            deleteTerminal(prod,perm){
                let self = this;
                self.$confirm('您确认要删除?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    productApi.deleteTerminal(perm.prodTCode).then(res=>{
                        self.$message.success("删除成功");
                        self.getProductTerminals(prod);
                    })
                }).catch(() => {
                    self.$message.info('已取消删除');
                });
            }
        },
        filters: {
            terminalTypeFilter(val){
               for(let i of terminalTypes){
                    if(i.value==val){
                        return i.label;
                    }
                }
                return val;
            }
        }
    }
</script>

<style scoped>

</style>
