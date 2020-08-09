<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增机构</el-button>
            </div>
        </div>
        <el-row>
            <el-table :data="tableData">
                <el-table-column prop="operation" label="操作" width="200px">
                    <template slot-scope="scope">
                       <el-button type="text" @click.stop="enterOrg(scope.row)">进入</el-button>
                        <el-button type="text" @click.stop="changePwd(scope.row)">修改密码</el-button>
                        <el-button type="text" @click.stop="showEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click.stop="deleteOne(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="机构名称" prop="orgName"></el-table-column>
                <el-table-column label="产品线" prop="prodName"></el-table-column>
                <el-table-column label="机构类型" prop="orgTypeName"></el-table-column>
                <el-table-column label="所属企业" prop="tenantName"></el-table-column>
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
        <el-drawer :visible.sync="drawerEdit" :with-header="false" size="40%">
            <div class="flex-between p20">
                <span>{{isEdit?"修改机构":"新增机构"}}</span>
                <span><i class="el-icon-close" @click="drawerEdit=false"></i></span>
            </div>
            <el-form :model="org" :rules="rules" ref="org" label-width="100px">
                <el-form-item label="所属企业" prop="tenantId">
                    <el-select v-model="org.tenantId" :disabled="isEdit" :filterable="!tenantId" :remote="!tenantId" :loading="loading" :remote-method="searchTenant">
                        <el-option v-for="(rad,index) in tenants" :key="rad.tenantId" :label="rad.tenantName" :value="rad.tenantId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构名称" prop="orgName">
                    <el-input v-model="org.orgName" placeholder="请输入机构名称" ></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="机构类型" prop="orgTypeCode" >
                            <el-select v-model="org.orgTypeCode" placeholder="请选择类型">
                                <el-option v-for="(rad,index) in orgTypes" :key="rad.orgTypeCode" :label="rad.orgTypeName" :value="rad.orgTypeCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品线" prop="prodCode" >
                            <el-select v-model="org.prodCode" placeholder="请选择产品线">
                                <el-option v-for="prod in products" :key="prod.prodCode" :label="prod.prodName" :value="prod.prodCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="principal" >
                            <el-input v-model="org.principal" placeholder="请输入负责人" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone" >
                            <el-input v-model="org.phone" placeholder="请输入手机号"  maxlength="11" minlength="11"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="登录账号" prop="loginAccount">
                    <el-input v-model="org.loginAccount" placeholder="请输入登录账号" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-row v-if="!isEdit">
                    <el-col :span="12">
                        <el-form-item label="密码" prop="password" >
                            <el-input v-model="org.password" placeholder="请输入密码" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="确认密码" prop="rePassword" >
                            <el-input v-model="org.rePassword" placeholder="请输入确认密码" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="启用" prop="enabled">
                    <el-switch  v-model="org.enabled" :active-value="1" :inactive-color="'0'" ></el-switch>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="cancelEdit()" >取消</el-button>
                    <el-button @click.native.prevent="submitEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-dialog title="重置密码" :visible.sync="resetPwdDialogVisible" width="30%" >
            <span>
                <el-input v-model="org.password" placeholder="请输入密码"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPwdDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitChangePwd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import orgApi from '../../api/system/org';
    import {Debounce} from "../../common/js/utils";
    import productApi from "../../api/system/product";
    import orgTypeApi from "../../api/system/orgType";
    import tenantApi from "../../api/system/tenant";
    import {changePwd,changeRole} from '../../api/user'
    import permsApi from "../../api/system/permission";
    import userApi from "../../api/system/user";


    export default {
        name: "system-org",
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else if(value.length<6 || value.length>12){
                    callback(new Error('请输入6-12位密码'));
                } else {
                    if (this.org.rePassword !== '') {
                        this.$refs.org.validateField('rePassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.org.password) {
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
                    {field: "orgName",label: "机构名称",input:{}},
                    {field: "orgTypeCode",label: "机构类型",select:{multi:false,items:[]}},
                    {field: "prodCode",label: "产品线",select:{multi:false,items:[]}},
                    {field: "principal",label: "负责人",input:{}},
                    {field: "phone",label: "手机号",input:{}},
                ],
                org:{
                    orgName:"",
                    orgTypeCode:"",
                    orgCode:"",
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
                    tenantId: [ {required: true, message: '请输入所属企业', trigger: 'blur'},],
                    orgName: [ {required: true, message: '请输入机构名称', trigger: 'blur'},],
                    orgTypeCode: [ {required: true, message: '请选择机构类型', trigger: 'blur'},],
                    orgCode: [ {required: true, message: '请输入机构编号', trigger: 'blur'},],
                    prodCode: [ {required: true, message: '请选择产品线', trigger: 'blur'},],
                    principal: [ {required: true, message: '请输入负责人', trigger: 'blur'},],
                    loginAccount: [ {required: true, message: '请输入账号', trigger: 'blur'},],
                    phone: [ {required: true, message: '请输入手机号', trigger: 'blur'},],
                    password: [  { validator: validatePass, trigger: 'blur' },],
                    rePassword: [  { validator: validatePass2, trigger: 'blur' },],
                },
                searchValue:{},
                isEdit:false,
                products:[],
                orgTypes:[],
                resetPwdDialogVisible:false,
                tenantId:null,
                tenantName:null,
                tenants:[],
                loading: false,
            }
        },
        activated() {
            this.tenantId = this.$route.params.tenantId;
            this.tenantName = this.$route.params.tenantName;
            this.tenants = [];
            this.searchValue = {};
            let tenantCon = {field: "tenantName",label: "企业名称"};
            let tenantIndex = this.searchConditions.findIndex(con=>con.field=="tenantName");
            if(tenantIndex>-1){
                this.searchConditions.splice(tenantIndex,1);
            }
            if(this.tenantId){
                tenantCon.default = {label:this.tenantName,value:this.tenantId};
                this.searchValue = {tenantId:this.tenantId}
                this.tenants.push({tenantId:this.tenantId,tenantName:this.tenantName});
            }else{
                tenantCon.input= {};
            }
            this.searchConditions.push(tenantCon);
            console.log("activated");// 菜单切换不触发，连接跳转触发
            this.doSearch(this.searchValue);
        },
        mounted() {
            console.log("mounted");
            this.getProducts();
            this.getOrgTypes();
            this.doSearch(this.searchValue);
        },
        methods:{
            doSearch(searchValue){
                this.searching = true;
                this.searchValue = searchValue;
                let that = this;
                orgApi.search(this.page.size,this.page.current,searchValue).then(res=>{
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
            getProducts(){
                let that = this;
                productApi.terminals().then(res=>{
                    let products = [];
                    let searchSelect = [];
                    for(let pt of res.data){
                        products.push({prodCode:pt.prodCode,prodName:pt.prodName});
                        searchSelect.push({label:pt.prodName,value:pt.prodCode});
                    }
                    that.products = products;
                    if(products.length){
                        that.org.prodCode=products[0].prodCode;
                    }
                    that.searchConditions[2].select.items = searchSelect;
                });
            },
            getOrgTypes(){
                let that = this;
                if(!that.orgTypes.length){
                    orgTypeApi.search({}).then(res=>{
                        that.orgTypes = res.data;
                        let searchSelect = [];
                        for(let pt of res.data){
                            searchSelect.push({label:pt.orgTypeName,value:pt.orgTypeCode});
                        }
                        that.searchConditions[1].select.items = searchSelect;
                        if(that.orgTypes.length){
                            that.org.orgTypeCode=that.orgTypes[0].prodCode;
                        }
                    })
                }
            },
            showDrawerAdd(){
                this.drawerEdit = true;
                this.isEdit = false;
                this.$refs['org'] && this.$refs['org'].clearValidate();
                this.org = {
                    orgName:"",
                    orgTypeCode:"",
                    orgCode:"",
                    tenantId:null,
                    prodCode:"",
                    principal:"",
                    phone:"",
                    loginAccount:"",
                    password:"",
                    rePassword:"",
                    enabled:1
                };
                if(this.products.length){
                    this.org.prodCode=this.products[0].prodCode;
                }
                if(this.orgTypes.length){
                    this.org.orgTypeCode=this.orgTypes[0].orgTypeCode;
                }
                if(this.tenants.length){
                    this.org.tenantId=this.tenants[0].tenantId;
                }
            },
            showEdit(org){
                this.showDrawerAdd();
                this.isEdit = true;
                let that = this;
                orgApi.detail(org.orgId).then(res=>{
                    that.org = res.data;
                    that.tenants = [];
                    that.tenants.push({tenantId:that.org.tenantId,tenantName:that.org.tenantName});
                });
            },
            deleteOne(org){
                let self = this;
                self.$confirm('您确认要删除?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    orgApi.deleteOrg(org.orgId).then(res=>{
                        self.$message.success("删除成功");
                        self.doSearch(this.searchValue);
                    })
                }).catch(() => {
                    self.$message.info('已取消删除');
                });
            },
            submitEdit:Debounce(function () {
                let self = this
                self.$refs['org'].validate((valid) => {
                    if (valid) {
                        orgApi.create(this.org).then(res => {
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
            // 切换机构
            enterOrg(org){
                //orgApi
            },
            changePwd(org){
                this.org = org;
                this.resetPwdDialogVisible = true;
            },
            submitChangePwd:Debounce(function () {
                let self = this;
                let user = {};
                user.userId = this.org.userId;
                user.password = this.org.password;
                userApi.resetPwd(this.org.userId,user).then(res=>{
                    if(res.status==200){
                        self.resetPwdDialogVisible = false;
                        self.$message.success('重置密码成功');
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                })
            },1000),
            searchTenant(q){
                if (q) {
                    this.loading = true;
                    let that = this;
                    let param = {tenantName:q};
                     tenantApi.search(20,1,param).then(res=>{
                         that.loading = false;
                         that.tenants = res.data.list.filter(item => {
                             return item.tenantName.toLowerCase().indexOf(q.toLowerCase()) > -1;
                         });
                     })
                } else {
                    this.tenants = [];
                }
            }
        },
    }
</script>

<style scoped>

</style>
