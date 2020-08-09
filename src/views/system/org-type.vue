<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增机构分类</el-button>
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
                <el-table-column label="类型编码" prop="orgTypeCode"></el-table-column>
                <el-table-column label="机构类型" prop="orgTypeName"></el-table-column>
            </el-table>
        </el-row>
        <!-- 编辑页 -->
        <el-drawer :visible.sync="drawerEdit" :with-header="false"  size="40%">
            <div class="flex-between p20">
                <span>{{isEdit?"修改机构类型":"新增机构类型"}}</span>
                <span><i class="el-icon-close" @click="drawerEdit=false"></i></span>
            </div>
            <el-form :model="perm" :rules="rules" ref="perm" label-width="100px">
                <el-form-item label="类型编码" prop="orgTypeCode">
                    <el-input v-model="perm.orgTypeCode" placeholder="请输入机构编码" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="机构类型" prop="orgTypeName">
                    <el-input v-model="perm.orgTypeName" placeholder="请输入类型类型" ></el-input>
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
    import orgTypeApi from '../../api/system/orgType';
    import {Debounce} from "../../common/js/utils";

    export default {
        name: "system-org-type",
        data(){
            return{
                drawerEdit:false,//编辑页
                drawerDetail:false,//详情页
                tableData:[],// 列表数据
                searchConditions:[// 搜索条件
                    {field: "orgTypeCode",label: "类型编码",input:{}},
                    {field: "orgTypeName",label: "机构类型",input:{}},
                ],
                perm:{
                    orgTypeCode:"",
                    orgTypeName:"",
                },
                rules: {
                    orgTypeCode: [ {required: true, message: '请输入权限编码', trigger: 'blur'},],
                    orgTypeName: [ {required: true, message: '请输入功能名称', trigger: 'blur'},],
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
                orgTypeApi.search(searchValue).then(res=>{
                    if(res.data){
                        that.tableData = res.data;
                    }else{
                        this.tableData = [];
                    }
                });
            },
            showDrawerAdd(){
                this.drawerEdit = true;
                this.isEdit = false;
                this.$refs['perm'] && this.$refs['perm'].clearValidate();
                this.perm = {
                    orgTypeCode:"",
                    orgTypeName:"",
                };
            },
            showEdit(perm){
                this.drawerEdit = true;
                this.isEdit = true;
                this.$refs['perm'] && this.$refs['perm'].clearValidate();
                this.perm = {
                    orgTypeCode:perm.orgTypeCode,
                    orgTypeName:perm.orgTypeName,
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
                    orgTypeApi.deleteType(perm.orgTypeCode).then(res=>{
                        self.$message.success("删除成功");
                        self.doSearch(this.searchValue);
                    })
                }).catch(() => {
                    self.$message.info('已取消删除');
                });
            },
            submitEdit:Debounce(function () {
                let self = this
                self.$refs['perm'].validate((valid) => {
                    if (valid) {
                        orgTypeApi.create(this.perm).then(res => {
                            if (res.status == 200) {
                                self.$message.success((self.isEdit ? '修改' : '添加') + '成功');
                                self.drawerEdit = false;
                                self.doSearch(this.searchValue);
                            } else {
                                res.message && self.$message.error(res.message);
                            }
                        });
                    }
                })
            },1000),
            cancelEdit(){
                this.drawerEdit = false;
            },
        },
    }
</script>

<style scoped>

</style>
