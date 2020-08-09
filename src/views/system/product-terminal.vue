<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增产品线</el-button>
            </div>
        </div>
        <el-row>
            <el-table :data="tableData">
                <el-table-column prop="operation" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="text" @click.stop="showEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click.stop="deleteOne(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="产品线编码" prop="prodCode"></el-table-column>
                <el-table-column label="产品线" prop="prodName"></el-table-column>
                <el-table-column label="终端编码" prop="prodTCode"></el-table-column>
                <el-table-column label="终端" prop="prodTName"></el-table-column>
                <el-table-column label="终端类型" prop="prodTType"></el-table-column>
            </el-table>
        </el-row>
        <!-- 编辑页 -->
        <el-drawer :visible.sync="drawerEdit" :with-header="false"  size="40%">
            <div class="flex-between p20">
                <span>{{isEdit?"修改产品线终端":"新增产品线终端"}}</span>
                <span><i class="el-icon-close"></i></span>
            </div>
            <el-form :model="perm" :rules="rules" ref="perm" label-width="100px">
                <el-form-item label="产品线" prop="prodName">
                    <el-input v-model="perm.prodName" placeholder="请输入产品线" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="终端编码" prop="prodCode">
                    <el-input v-model="perm.prodTCode" placeholder="请输入终端编码" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="终端" prop="prodName">
                    <el-input v-model="perm.prodTName" placeholder="请输入终端" ></el-input>
                </el-form-item>
                <el-form-item label="终端类型" prop="prodTType">
                    <el-input v-model="perm.prodTType" placeholder="请输入终端类型" ></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="cancelEdit()" >取消</el-button>
                    <el-button @click.native.prevent="submitEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import productApi from '../../api/system/product';
    export default {
        name: "system-product-terminal",
        data(){
            return{
                drawerEdit:false,//编辑页
                drawerDetail:false,//详情页
                tableData:[],// 列表数据
                searchConditions:[// 搜索条件
                    {field: "prodCode",label: "产品线编码",input:{}},
                    {field: "prodName",label: "产品线",input:{}},
                    {field: "prodTCode",label: "终端编码",input:{}},
                    {field: "prodTName",label: "终端名称",input:{}},
                    {field: "prodTType",label: "终端类型",input:{}},
                ],
                perm:{
                    prodCode:"",
                    prodName:"",
                    prodTCode:"",
                    prodTName:"",
                    prodTType:""
                },
                rules: {
                    prodCode: [ {required: true, message: '请输入产品线编码', trigger: 'blur'},],
                    prodName: [ {required: true, message: '请输入产品线名称', trigger: 'blur'},],
                    prodTCode: [ {required: true, message: '请输入终端编码', trigger: 'blur'},],
                    prodTName: [ {required: true, message: '请输入终端名称', trigger: 'blur'},],
                    prodTType: [ {required: true, message: '请输入终端类型', trigger: 'blur'},],
                },
                searchValue:{},
                isEdit:false,
            }
        },
        mounted() {
            this.doSearch(this.searchValue);
        },
        methods:{
            doSearch(searchValue){
                this.searchValue = searchValue;
                let that = this;
                productApi.searchTerminals(searchValue).then(res=>{
                    if(res.data){
                        that.tableData = res.data;
                    }
                });
            },
            showDrawerAdd(){
                this.drawerEdit = true;
                this.isEdit = false;
                this.$refs['perm'].clearValidate();
                this.perm = {
                    prodCode:"",
                    prodName:"",
                    prodTCode:"",
                    prodTName:"",
                    prodTType:""
                };
            },
            showEdit(perm){
                this.drawerEdit = true;
                this.isEdit = true;
                this.$refs['perm'].clearValidate();
                this.perm = {
                    prodCode:perm.prodCode,
                    prodName:perm.prodName,
                    prodTCode:perm.prodTCode,
                    prodTName:perm.prodTName,
                    prodTType:perm.prodTType
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
                    productApi.deleteTerminal(perm.prodCode).then(res=>{
                        self.$message({
                            message: '删除成功!',
                            type: 'success'
                        });
                        self.doSearch(this.searchValue);
                    })
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            submitEdit(){
                let self = this
                self.$refs['perm'].validate((valid) => {
                    if (valid) {
                        productApi.createTerminal(this.perm).then(res => {
                            if (res.status == 200) {
                                self.$message({
                                    type: 'success',
                                    message: (self.isEdit ? '修改' : '添加') + '成功'
                                });
                                this.drawerEdit = false;
                                self.doSearch(this.searchValue);
                            } else {
                                res.message && self.$message({
                                    type: 'warn',
                                    message: res.message
                                });
                            }
                        });
                    }
                });
            },
            cancelEdit(){
                this.drawerEdit = false;
            },
        },
    }
</script>

<style scoped>

</style>
