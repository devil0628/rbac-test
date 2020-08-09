<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增用户</el-button>
            </div>
        </div>
        <el-row>
            <el-table :data="tableData">
                <el-table-column prop="operation" label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button type="text" @click.stop="showEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click.stop="showAssignRole(scope.row)">分配角色</el-button>
                        <el-button type="text" @click.stop="resetPwd(scope.row)">重置密码</el-button>
                        <el-button type="text" @click.stop="deleteOne(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="账号" prop="loginAccount" width="200"></el-table-column>
                <el-table-column label="姓名" prop="username" width="120"></el-table-column>
                <el-table-column label="手机号" prop="phone" width="200"></el-table-column>
                <el-table-column label="角色" min-width="180">
                    <template slot-scope="scope">
                        <el-popover  placement="top-start"  trigger="hover" >
                            <p v-for="role in scope.row.roles">{{ "[ "+role.prodName+" ] "+role.roleName+(scope.row.roles[0].tenantName || scope.row.roles[0].orgName?" ( "+scope.row.roles[0].tenantName+"-"+scope.row.roles[0].orgName+" ) ":"") }}</p>
                            <div slot="reference" class="name-wrapper content-limit">
                                <span slot="reference">{{scope.row.roles.length?(
                                    "[ "+scope.row.roles[0].prodName+" ] "
                                    +scope.row.roles[0].roleName
                                    +(scope.row.roles[0].tenantName || scope.row.roles[0].orgName?" ( "+scope.row.roles[0].tenantName+"-"+scope.row.roles[0].orgName+" ) ":"")
                                    +(scope.row.roles.length>1?" ["+scope.row.roles.length+" ]":"")
                                    ):""}}</span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="最后登录" prop="lastLoginTime" width="160"></el-table-column>
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
                <span>{{drawTitle}}</span>
                <span><i class="el-icon-close" @click="drawerEdit=false"></i></span>
            </div>
            <el-form :model="perm" :rules="rules" ref="perm" label-width="100px">
                <el-form-item label="账号" prop="loginAccount">
                    <el-input v-model="perm.loginAccount" placeholder="请输入账号" maxlength="12" minlength="4"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="!isEdit" :required="!isEdit">
                    <el-input  type="password" v-model="perm.password" placeholder="请输入密码" autocomplete="off" maxlength="12" minlength="6"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="rePassword" v-if="!isEdit" :required="!isEdit">
                    <el-input  type="password" v-model="perm.rePassword" placeholder="请输入确认密码" autocomplete="off"  maxlength="12" minlength="6"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" prop="username">
                    <el-input v-model="perm.username" placeholder="请输入用户姓名" ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="perm.phone" placeholder="请输入手机号" maxlength="11" minlength="11"></el-input>
                </el-form-item>
                <el-form-item label="产品线">
                    <el-select v-model="perm.prodCode" placeholder="请选择产品线">
                        <el-option v-for="prod in products" :key="prod.prodCode" :label="prod.prodName" :value="prod.prodCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="drawerEdit = false" >取消</el-button>
                    <el-button @click.native.prevent="submitEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-dialog title="重置密码" :visible.sync="resetUserPwdDialogVisible" width="30%" >
            <span>
                <el-input v-model="nowUser.password" placeholder="请输入密码"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetUserPwdDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChangeUserPwd">确 定</el-button>
            </span>
        </el-dialog>

        <mult-select ref="roleDialog"
                     :search-data="roleSearchCondition"
                     :selected-data="roleSelected"
                     :id-use-equal="'roleId'"
                     :api-fun="roleApi.search"
                     :column-label="roleColumn"
                     :only-dialog="true"
                     @update="submitUserRole"

        ></mult-select>
    </div>
</template>

<script>
    import userApi from '../../api/system/user';
    import roleApi from "../../api/system/role";
    import productApi from '../../api/system/product';
    import {Debounce} from "../../common/js/utils";
    import multSelect from "../../components/selectDialog/multSelect";

    export default {
        name: "system-user",
        components:{
            multSelect
        },
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else if(value.length<6 || value.length>12){
                    callback(new Error('请输入6-12位密码'));
                } else {
                    if (this.perm.rePassword !== '') {
                        this.$refs.perm.validateField('rePassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.perm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                roleApi,
                page:{
                    size:10,
                    current:1,
                    total:0
                },
                drawerEdit:false,//编辑页
                drawerDetail:false,//详情页
                drawTitle:'新增用户',
                tableData:[],// 列表数据
                searchConditions:[// 搜索条件
                    {field: "loginAccount",label: "账号",input:{}},
                    {field: "username",label: "姓名",input:{}},
                    {field: "roleName",label: "角色名称",input:{}},
                    {field: "roleType",label: "角色类型",select:{multi:false,items:[]}},
                    {field: "phone",label: "手机号",input:{}},
                    {field: "prodCode",label: "产品线",select:{multi:false,items:[]}},
                    {field: "orgId",label: "机构",input:{}},
                    {field: "tenantId",label: "租户",input:{}},
                ],
                perm:{
                    loginAccount:"",
                    username:"",
                    password:"",
                    phone:"",
                },
                rules: {
                    loginAccount: [ {required: true, message: '请输入账号', trigger: 'blur'},],
                    username: [ {required: true, message: '请输入用户名', trigger: 'blur'},],
                    password: [  { validator: validatePass, trigger: 'blur' },],
                    rePassword: [  { validator: validatePass2, trigger: 'blur' },],
                    phone: [ {required: true, message: '请输入手机号', trigger: 'blur'} ],
                },
                products:[],//产品线
                isEdit:false,
                resetUserPwdDialogVisible:false,
                nowUser:{},
                searchValue:{},

                roleSelected:[],
                roleSearchCondition:[
                    {field: "roleName",label: "角色名称",input:{}},
                    {field: "roleCode",label: "角色编码",input:{}},
                ],
                roleColumn:[
                    {label:'角色编码',  value:'roleCode'},
                    {label:'角色名称',value:'roleName'},
                    {label:'角色类型',value:'roleTypeName'}
                ]
            }
        },
        mounted() {
            this.doSearch({});
            this.getProducts();
        },
        methods:{
            doSearch(searchValue){
                let that = this;
                this.searchValue = searchValue;
                userApi.search(this.page.size,this.page.current,searchValue).then(res=>{
                    if(res.data && res.data.list){
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
            getProducts(){
                let that = this;
                productApi.terminals().then(res=>{
                    let products = [];
                    for(let pt of res.data){
                        products.push({prodCode:pt.prodCode,prodName:pt.prodName});
                    }
                    that.products = products;
                });
            },
            showDrawerAdd(){
                this.drawTitle = "新增用户";
                this.drawerEdit = true;
                this.isEdit = false;
                this.perm={
                    loginAccount:"",
                    username:"",
                    password:"",
                    phone:"",
                }
                if(this.products.length){
                    this.perm.prodCode=this.products[0].prodCode;
                }
                this.$nextTick(()=>{
                    this.$refs['perm'] && this.$refs['perm'].clearValidate();
                })
            },
            showEdit(perm){
                this.drawTitle = "修改用户";
                this.drawerEdit = true;
                this.isEdit = true;
                this.$refs['perm'] && this.$refs['perm'].clearValidate();
                let that = this;
                userApi.detail(perm.userId).then(res=>{
                    that.perm = res.data;
                });
            },
            resetPwd(user){
                this.nowUser = user;
                this.resetUserPwdDialogVisible = true;
            },
            submitChangeUserPwd(){
                let self = this;
                userApi.resetPwd(this.nowUser.userId,this.nowUser).then(res=>{
                    if(res.status==200){
                        self.resetUserPwdDialogVisible = false;
                        self.$message.success('重置密码成功');
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                })
            },
            deleteOne(user){
                let self = this;
                self.$confirm('您确认要删除该用户?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    userApi.deleteUser(user.userId).then(res=>{
                        if(res.status==200){
                            self.$message.success('删除成功');
                            self.doSearch(self.searchValue);
                        }else{
                            res.message && self.$message.error(res.message);
                        }
                    })
                }).catch(() => {
                    self.$message.info('已取消删除');
                });
            },
            submitEdit:Debounce(function () {
                let self = this;
                self.$refs['perm'].validate((valid) => {
                    if (valid) {
                        if (self.perm.userId) {
                            userApi.update(this.perm.userId, this.perm).then(res=>{
                                if(res.status==200){
                                    self.$message.success('修改成功');
                                    self.drawerEdit = false;
                                    self.doSearch(self.searchValue);
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                        } else {
                            userApi.create(this.perm).then(res=>{
                                if(res.status==200){
                                    self.$message.success('添加成功');
                                    self.drawerEdit = false;
                                    self.doSearch(self.searchValue);
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                        }
                    }
                });
            },1000),
            showAssignRole(user){
                this.nowUser = user;
                this.$refs.roleDialog.showDialog();
                this.$nextTick(()=>{
                    this.roleSelected = this.nowUser.roles||[];
                });
            },
            submitUserRole(roles){
                //TODO 不能重复选择角色
                let roleIds = [];
                if(roles){
                    for(let r of roles){
                        roleIds.push(r.roleId);
                    }
                }
                this.roleSelected = roles;
                let self = this;
                userApi.assignRoles(this.nowUser.userId,roleIds).then(res=>{
                    if(res.status==200){
                        self.$message.success('分配角色成功');
                        self.doSearch(self.searchValue);
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                });
            }
        },
        filters: {
        }
    }
</script>

<style scoped>

</style>
