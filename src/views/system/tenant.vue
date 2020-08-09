<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增企业</el-button>
            </div>
        </div>
        <el-row>
            <el-table :data="tableData">
                <el-table-column prop="operation" label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="text" @click.stop="manageOrg(scope.row)">下属机构</el-button>
                        <el-button type="text" @click.stop="changePwd(scope.row)">修改密码</el-button>
                        <el-button type="text" @click.stop="showEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click.stop="deleteOne(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="企业名称" prop="tenantName"></el-table-column>
                <el-table-column label="状态" prop="enabled">
                    <template slot-scope="scope">
                        <span>{{scope.row.enabled==1?"开启":"禁用"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="负责人" prop="principal"></el-table-column>
                <el-table-column label="手机" prop="phone"></el-table-column>
                <el-table-column label="账号" prop="loginAccount"></el-table-column>
            </el-table>
            <div class="pagination">
                <div class="block">
                    <el-pagination @current-change="handlePageCurrentChange" :current-page="page.current" :page-size="page.size" layout="total, prev, pager, next" :total="page.total" ></el-pagination>
                </div>
            </div>
        </el-row>
        <!-- 编辑页 -->
        <el-drawer :visible.sync="drawerEdit" :with-header="false"  size="40%">
            <div class="flex-between p20">
                <span>{{isEdit?"修改企业":"新增企业"}}</span>
                <span><i class="el-icon-close" @click="drawerEdit=false"></i></span>
            </div>
            <el-form :model="tenant" :rules="rules" ref="tenant" label-width="100px">
                <el-form-item label="企业名称" prop="tenantName">
                    <el-input v-model="tenant.tenantName" placeholder="请输入企业名称" ></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="principal" >
                            <el-input v-model="tenant.principal" placeholder="请输入负责人" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone" >
                            <el-input v-model="tenant.phone" placeholder="请输入手机号"  maxlength="11" minlength="11"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="登录账号" prop="loginAccount">
                    <el-input v-model="tenant.loginAccount" placeholder="请输入登录账号" ></el-input>
                </el-form-item>
                <el-row v-if="!isEdit">
                    <el-col :span="12">
                        <el-form-item label="密码" prop="password" >
                            <el-input v-model="tenant.password" placeholder="请输入密码" :disabled="isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="确认密码" prop="rePassword" >
                            <el-input v-model="tenant.rePassword" placeholder="请输入确认密码" :disabled="isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="启用" prop="enabled">
                    <el-switch  v-model="tenant.enabled" :active-value="1" :inactive-color="'0'" ></el-switch>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="cancelEdit()" >取消</el-button>
                    <el-button @click.native.prevent="submitEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
        <el-dialog title="重置密码" :visible.sync="resetPwdDialogVisible" width="30%" >
            <span>
                <el-input v-model="tenant.password" placeholder="请输入密码"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPwdDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChangePwd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import tenantApi from '../../api/system/tenant';
    import {Debounce} from "../../common/js/utils";
    import productApi from "../../api/system/product";
    import orgApi from "../../api/system/org";
    import userApi from "../../api/system/user";

    export default {
        name: "system-tenant",
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else if(value.length<6 || value.length>12){
                    callback(new Error('请输入6-12位密码'));
                } else {
                    if (this.tenant.rePassword !== '') {
                        this.$refs.tenant.validateField('rePassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.tenant.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                page:{
                    size:10,
                    current:1,
                    total:0
                },
                drawerEdit:false,//编辑页
                drawerDetail:false,//详情页
                tableData:[],// 列表数据
                searchConditions:[// 搜索条件
                    {field: "tenantName",label: "企业名称",input:{}},
                    {field: "principal",label: "负责人",input:{}},
                    {field: "phone",label: "手机号",input:{}},
                ],
                tenant:{
                    tenantName:"",
                    tenantCode:"",
                    tenantId:null,
                    prodCode:"",
                    principal:"",
                    phone:"",
                    loginAccount:"",
                    password:"",
                    rePassword:"",
                    enabled:1
                },
                rules: {
                    tenantName: [ {required: true, message: '请输入企业名称', trigger: 'blur'},],
                    tenantCode: [ {required: true, message: '请输入企业编号', trigger: 'blur'},],
                    principal: [ {required: true, message: '请输入负责人', trigger: 'blur'},],
                    loginAccount: [ {required: true, message: '请输入账号', trigger: 'blur'},],
                    phone: [ {required: true, message: '请输入手机号', trigger: 'blur'},],
                    password: [  { validator: validatePass, trigger: 'blur' },],
                    rePassword: [  { validator: validatePass2, trigger: 'blur' },],
                },
                searchValue:{},
                isEdit:false,
                resetPwdDialogVisible:false
            }
        },
        mounted() {
            this.doSearch(this.searchValue);
        },
        methods:{
            doSearch(searchValue){
                this.searchValue = searchValue;
                let that = this;
                tenantApi.search(this.page.size,this.page.current,searchValue).then(res=>{
                    if(res.data){
                        that.tableData = res.data.list;
                        that.page.total = res.data.total;
                    }else{
                        that.tableData = [];
                        that.page.total = 0;
                    }
                });
            },
            handlePageCurrentChange(val){
                this.page.current = val;
                this.doSearch(this.searchValue);
            },
            showDrawerAdd(){
                this.drawerEdit = true;
                this.isEdit = false;
                this.$refs['tenant'] && this.$refs['tenant'].clearValidate();
                this.tenant = {
                    tenantName:"",
                    tenantTypeCode:"",
                    tenantCode:"",
                    tenantId:null,
                    principal:"",
                    phone:"",
                    loginAccount:"",
                    password:"",
                    rePassword:"",
                    enabled:1
                };
            },
            showEdit(tenant){
                this.drawerEdit = true;
                this.isEdit = true;
                this.$refs['tenant'] && this.$refs['tenant'].clearValidate();
                let that = this;
                tenantApi.detail(tenant.tenantId).then(res=>{
                    that.tenant = res.data;
                });
            },
            deleteOne(tenant){
                let self = this;
                self.$confirm('您确认要删除?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    tenantApi.deleteTenant(tenant.tenantId).then(res=>{
                        self.$message.success("删除成功");
                        self.doSearch(this.searchValue);
                    })
                }).catch(() => {
                    self.$message.info('已取消删除');
                });
            },
            submitEdit:Debounce(function () {
                let self = this
                self.$refs['tenant'].validate((valid) => {
                    if (valid) {
                        tenantApi.create(this.tenant).then(res => {
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
            changePwd(tenant){
                this.tenant = tenant;
                this.resetPwdDialogVisible = true;
            },
            submitChangePwd:Debounce(function () {
                let self = this;
                let user = {};
                user.userId = this.tenant.userId;
                user.password = this.tenant.password;
                userApi.resetPwd(this.tenant.userId,user).then(res=>{
                    if(res.status==200){
                        self.resetPwdDialogVisible = false;
                        self.$message.success('重置密码成功');
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                })
            },1000),
            manageOrg(tenant){
                this.$router.push({name: 'system-tenant-org',params:{tenantId:tenant.tenantId,tenantName:tenant.tenantName}});
            }
        },
    }
</script>

<style scoped>

</style>
