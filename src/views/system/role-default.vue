<template>
    <div class="system-role-default">
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增角色</el-button>
            </div>
        </div>

        <el-row>
            <el-table :data="tableData">
                <el-table-column prop="operation" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click.stop="showEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click.stop="showDetail(scope.row)">详情</el-button>
                        <el-button type="text" @click.stop="deleteOne(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="角色编码" prop="roleCode" width="200"></el-table-column>
                <el-table-column label="角色名称" prop="roleName" width="200"></el-table-column>
                <el-table-column label="角色类型" prop="roleTypeName" width="80"></el-table-column>
                <el-table-column label="标准角色" prop="standardRole" width="80">
                    <template slot-scope="scope">{{scope.row.standardRole | filterRoleStandard}}</template>
                </el-table-column>
                <el-table-column label="终端" >
                    <template slot-scope="scope">
                        <el-tag v-for="(tag,index) in scope.row.terminals" :key="index">
                            {{tag.prodTName}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="描述" >
                    <template slot-scope="scope">
                        <el-popover  placement="top-start"  trigger="hover" >
                            <p>{{ scope.row.description }}</p>
                            <div slot="reference" class="name-wrapper content-limit">
                                <span slot="reference">{{scope.row.description}}</span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
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
                <span>{{drawTitle}}</span>
                <span><i class="el-icon-close" @click="drawerEdit=false"></i></span>
            </div>
            <el-form :model="role" :rules="rules" ref="role" label-width="100px">
                <el-form-item label="角色编码" prop="roleCode" >
                    <el-input v-model="role.roleCode" placeholder="请输入角色编码" ></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName" >
                    <el-input v-model="role.roleName" placeholder="请输入功能名称" ></el-input>
                </el-form-item>
                <el-form-item label="角色类型" prop="roleType">
                    <el-radio-group v-model="role.roleType" >
                        <el-radio v-for="(rad,index) in roleTypeList" :key="rad.value" :label="rad.value">{{rad.label}}</el-radio>
                        <el-radio v-for="(rad,index) in orgTypes" :key="rad.orgTypeCode" :label="rad.orgTypeCode">{{rad.orgTypeName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="标准角色" prop="standardRole" v-if="userInfo.currentRoleType==ROLE_TYPE.SYSTEM.key">
                    <el-switch v-model="role.standardRole"  :active-value="1" :inactive-color="'0'"></el-switch>
                </el-form-item>
                <el-form-item label="产品线" prop="prodCode">
                    <el-select v-model="role.prodCode" placeholder="请选择产品线" @change="changeProduct">
                        <el-option v-for="prod in products" :key="prod.prodCode" :label="prod.prodName" :value="prod.prodCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="终端" prop="prodTCodes">
                    <el-checkbox-group v-model="role.prodTCodes" @change="handleCheckbox" >
                        <el-checkbox v-for="prod in terminals" :key="prod.prodTCode" :label="prod.prodTCode">{{prod.prodTName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="描述" >
                    <el-input type="textarea" v-model="role.description" placeholder="请输入描述" ></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="drawerEdit=false" >取消</el-button>
                    <el-button @click.native.prevent="submitEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import roleApi from "../../api/system/role";
    import productApi from "../../api/system/product";
    import {Debounce,deepCopy} from "../../common/js/utils";
    import orgTypeApi from "../../api/system/orgType";
    //store
    import {mapState} from 'vuex'
    import {ROLE_TYPE} from '../../common/js/config'

     export default {
        name: "system-role-default",
        data(){
            return{
                ROLE_TYPE,
                page:{
                    size:10,
                    current:1,
                    total:0
                },
                drawerEdit:false,//编辑页
                drawTitle:'新增角色',
                tableData:[],// 列表数据
                roleTypeList:[],
                searchConditions:[// 搜索条件
                    {field: "roleName",label: "角色名称",input:{}},
                    {field: "roleType",label: "角色类型",select:{multi:false,items:[]}},
                    {field: "standardRole",label: "标准角色",select:{multi:false,items:[{label:"否",value:0},{label:"是",value:1}]}},
                    {field: "description",label: "描述",input:{}},
                    {field: "prodCode",label: "产品线",select:{multi:false,items:[]}},
                ],
                role:{
                    roleCode:"",
                    roleName:"",
                    roleType:"SYSTEM",
                    description:"",
                    standardRole:0,// 默认非标准
                    prodCode:"",
                    prodTCodes:[]
                },
                rules: {
                    roleCode: [ {required: true, message: '请输入角色编码', trigger: 'blur'},],
                    roleName: [ {required: true, message: '请输入功能名称', trigger: 'blur'},],
                    roleType: [ {required: true, message: '请选择类型', trigger: 'blur'},],
                    prodCode: [ {required: true, message: '请选择产品线', trigger: 'blur'},],
                    prodTCodes: [ {required: true, message: '请选择终端', trigger: 'blur'},],

                },
                products:[],//产品线
                terminals:[],
                orgTypes:[],
                searchValue:[]
            }
        },
         computed:{
             ...mapState('system',['userInfo']),
         },
         beforeMount (){// 处理角色数据
             this.roleTypeList=[];
             switch (this.userInfo.currentRoleType) {
                case ROLE_TYPE.SYSTEM.key:
                    this.roleTypeList.push({label:'系统', value:'SYSTEM'});
                 case ROLE_TYPE.PLATFORM.key:
                     this.roleTypeList.push({label:'平台',value:'PLATFORM'});
                 case ROLE_TYPE.TENANT.key:
                     this.roleTypeList.push({label:'租户',value:'TENANT'});
                 case ROLE_TYPE.ORG.key:
                     this.roleTypeList.push({label:'机构', value:'ORG'});
                 case ROLE_TYPE.ORG_TYPE.key:
                     //this.roleTypeList.push();
                 case ROLE_TYPE.USER.key:
                     //this.roleTypeList.push();
             }
             if(this.roleTypeList.length==0 && this.userInfo.currentRoleType==ROLE_TYPE.USER.key){
                for(let role of this.userInfo.roles){
                    this.roleTypeList.push({label:role.roleTypeName, value:role.roleType});
                }
             }
         },
         mounted() {
             this.doSearch({});
             this.getProducts();
             this.getOrgTypes();
        },
        methods:{
            handleCheckbox(val){
                // TODO 不加选不中
                this.$forceUpdate();
            },
            doSearch(searchValue){
                this.searchValue = searchValue;
                let that = this;
                roleApi.search(this.page.size,this.page.current,searchValue).then(res =>{
                    if(res.data && res.data.list){
                        that.tableData = res.data.list;
                        that.page.total = res.data.total;
                    }else{
                        that.page.total = 0;
                    }
                })
            },
            handlePageCurrentChange(val){
                this.page.current = val;
                this.doSearch(this.searchValue);
            },
            getOrgTypes(){
                let that = this;
                if(!that.orgTypes.length){
                    orgTypeApi.search({}).then(res=>{
                        that.orgTypes = res.data;
                        // 搜索条件
                        let types = that.roleTypeList.length?deepCopy(that.roleTypeList):[];
                        for(let pt of that.orgTypes){
                            types.push({value:pt.orgTypeCode,label:pt.orgTypeName});
                        }
                        that.searchConditions[1].select.items=types;
                    })
                }
            },
            getProducts(){
                let that = this;
                productApi.terminals().then(res=>{
                    let  products = res.data;
                    // 系统和平台才有查看所有业务线权限
                    if(ROLE_TYPE.compareRole(that.userInfo.currentRoleType,ROLE_TYPE.PLATFORM)>=0){
                        that.products = deepCopy(products);
                    }else{
                        // 其它角色，用自己角色所属的业务线
                        let userProds = {};
                        for(let ur of that.userInfo.roles){
                            userProds[ur.prodCode] = true;
                        }
                        for(let p of products){
                            if(userProds[p.prodCode]){
                                that.products.push(p);
                            }
                        }
                    }
                    let productsSearch = [];
                    if(that.products.length){
                        for(let pt of that.products){
                            productsSearch.push({value:pt.prodCode,label:pt.prodName});
                        }
                        that.role.prodCode = that.products[0].prodCode;
                        that.terminals = deepCopy(that.products[0].terminals);
                        that.role.prodTCodes.push(that.terminals[0].prodTCode);
                    }

                    that.searchConditions[4].select.items=productsSearch


                });
            },
            changeProduct(pro){
                this.terminals = deepCopy(pro.terminals);
            },
            showDrawerAdd(){
                this.drawTitle = "新增角色";
                this.drawerEdit = true;
                this.$refs['role'] && this.$refs['role'].clearValidate();
                this.role={
                    roleCode:"",
                    roleName:"",
                    roleType:"SYSTEM",
                    description:"",
                    standardRole:0,
                    prodTCodes:[],
                }
                // 默认角色类型
                this.role.roleType = this.roleTypeList.length?this.roleTypeList[0].value: this.orgTypes[0].orgTypeCode;
                if(this.products.length){
                    this.role.prodCode = this.products[0].prodCode;
                    this.terminals = deepCopy(this.products[0].terminals);
                    this.role.prodTCodes.push(this.terminals[0].prodTCode);
                }
            },
            showEdit(role){
                this.drawTitle = "修改角色";
                this.drawerEdit = true;
                this.$refs['role'] && this.$refs['role'].clearValidate();
                let that = this;
                roleApi.detail(role.roleId).then(res=>{
                    that.role = res.data;
                    let index = that.products.findIndex(p=>p.prodCode==that.role.prodCode);
                    if(that.products && that.products[index]){
                        that.terminals = deepCopy(that.products[index].terminals);
                    }
                    if(that.role.terminals){
                        that.role.prodTCodes = [];
                        that.role.terminals.map(t=>{
                            that.role.prodTCodes.push(t.prodTCode);
                        });
                    }
                });
            },
            showDetail(role){
                this.$router.push({name: 'system-role-detail',params:{roleId:role.roleId}});
            },
            deleteOne(role){
                let self = this;
                self.$confirm('您确认要删除该角色?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    roleApi.deleteRole(role.roleId).then(res=>{
                        if(res.status==200){
                            self.$message.success('删除成功');
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
                self.$refs['role'].validate((valid) => {
                    if (valid) {
                        if(self.role.standardRole){
                            self.role.standardRole = 1;
                        }else{
                            self.role.standardRole = 0;
                        }
                        if(self.role.roleId){
                            roleApi.update(self.role.roleId,self.role).then(res=>{
                                if(res.status==200){
                                    self.$message.success('更新成功');
                                    self.drawerEdit = false;
                                    self.doSearch(self.searchValue);
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                        }else{
                            roleApi.create(self.role).then(res=>{
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
        },
        filters: {
            filterRoleStandard(val){
                if (0==val) return '否';
                if (1==val) return '是';
                return val;
            },
        }
    }
</script>

<style scoped lang="scss">
    .system-role-default .el-tag{
            margin-right: 5px;
    }
</style>
