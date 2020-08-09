<template>
    <div class="system-role-detail">
        <el-form label-width="100px">
            <el-row>
                <el-col :span="6"><el-form-item label="角色名称" >{{role.roleName}}</el-form-item></el-col>
                <el-col :span="6"><el-form-item label="角色类型" >{{role.roleTypeName}}</el-form-item></el-col>
            </el-row>
            <el-row>
                <el-col :span="6"><el-form-item label="标准角色" >{{role.standardRole?'是':'否'}}</el-form-item></el-col>
                <el-col :span="6"><el-form-item label="角色编码" >{{role.roleCode}}</el-form-item></el-col>
            </el-row>
            <el-row>
                <el-col :span="6"><el-form-item label="产品线" >{{role.prodName}}</el-form-item></el-col>
                <el-col :span="6"><el-form-item label="终端" >
                    <el-tag v-for="tag in role.terminals" :key="tag.id">
                        {{tag.prodTName}}
                    </el-tag>
                </el-form-item></el-col>
            </el-row>
            <el-row>
                <el-col :span="18"><el-form-item label="描述" >{{role.description}}</el-form-item></el-col>
            </el-row>
        </el-form>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="菜单权限" name="menus">
                <div class="flex-between pr20">
                    <div><el-button type="primary" @click="showMenuAdd" size="small">添加菜单</el-button></div>
                    <searchTool :conditions="searchMenusConditions" @click="searchRoleMenus"></searchTool>
                </div>
                <el-table :data="menus" size="small" border style="margin-top: 10px" ref="menuTable"
                          row-key="menuId" :tree-props="{children: 'subMenus'}"  :expand-row-keys="menusExpands">
                    <el-table-column label="菜单名称" prop="menuName" width="200"></el-table-column>
                    <el-table-column label="终端" prop="prodTName" width="150"></el-table-column>
                    <el-table-column label="菜单类型" prop="menuTypeName" width="100"> </el-table-column>
                    <el-table-column label="功能权限" >
                        <template slot-scope="scope">
                            <p v-for="perm in scope.row.funcPerms">{{ perm.permsName }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作" >
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteData(scope.row.menuId, menus,'menus')" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="功能权限" name="perms">
                <div class="flex-between pr20">
                    <div><el-button type="primary" @click="showPermsAdd" size="small">添加功能</el-button></div>
                    <searchTool :conditions="searchPermsConditions" @click="searchRolePerms"></searchTool>
                </div>
                <el-table :data="perms" size="small" border style="margin-top: 10px">
                    <el-table-column label="权限编码" prop="permsCode" width="200"></el-table-column>
                    <el-table-column label="功能名称" prop="permsName" width="200"></el-table-column>
                    <el-table-column label="权限类型" prop="permsType" width="100">
                        <template slot-scope="scope">{{scope.row.permsType | filterPermsType}}</template>
                    </el-table-column>
                    <el-table-column label="关联菜单" >
                        <template slot-scope="scope">
                            <el-popover  placement="top-start"  trigger="hover" >
                                <p v-for="menu in scope.row.menus">{{ "["+menu.menuTypeName+"]"+ "["+menu.prodTName+"]"+
                                    menu.parentMenuName+"-"+menu.menuName }}</p>
                                <div slot="reference" class="name-wrapper content-limit">
                                <span slot="reference">{{scope.row.menus.length?(
                                    "["+scope.row.menus[0].menuTypeName+"]"+ "["+scope.row.menus[0].prodTName+"]"+
                                    scope.row.menus[0].parentMenuName+"-"+scope.row.menus[0].menuName+"["+scope.row.menus.length+"]"
                                    ):''}}</span>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="引用角色" >
                        <template slot-scope="scope">
                            <el-popover  placement="top-start"  trigger="hover" >
                                <p v-for="role in scope.row.roles">{{ role.roleName }}</p>
                                <div slot="reference" class="name-wrapper content-limit">
                                    <span slot="reference">{{scope.row.roleNums?scope.row.roleNums:"0"}}</span>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作" >
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteData(scope.$index, perms,'perms')" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @current-change="handlePermsPageCurrentChange" :current-page="permsPage.current" :page-size="permsPage.size" layout="total, prev, pager, next" :total="permsPage.total" ></el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="数据权限" name="dataPerms">
                <div class="flex-between pr20">
                    <div><el-button type="primary" @click="showDataPermsAdd" size="small">添加数据</el-button></div>
                    <searchTool :conditions="searchDataPermsConditions" @click="searchRoleDataPerms"></searchTool>
                </div>
                <el-table :data="dataPerms" size="small" border style="margin-top: 10px">
                    <el-table-column label="数据表" prop="tableName"></el-table-column>
                    <el-table-column label="字段" prop="colName"></el-table-column>
                    <el-table-column label="限定词" prop="operation"></el-table-column>
                    <el-table-column label="数据值" prop="targetValue"></el-table-column>
                    <el-table-column prop="operation" label="操作" >
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteData(scope.$index, dataPerms,'dataPerms')" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @current-change="handleDataPermsPageCurrentChange" :current-page="dataPermsPage.current" :page-size="dataPermsPage.size" layout="total, prev, pager, next" :total="dataPermsPage.total" ></el-pagination>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="引用用户" name="users">
                <div class="flex-between pr20">
                    <div><el-button type="primary" @click="showUsersAdd" size="small">添加用户</el-button></div>
                    <searchTool :conditions="searchUsersConditions" @click="searchRoleUsers"></searchTool>
                </div>
                <el-table :data="users" size="small" border style="margin-top: 10px">
                    <el-table-column label="登录账号" prop="loginAccount"></el-table-column>
                    <el-table-column label="用户姓名" prop="username"></el-table-column>
                    <el-table-column label="手机号" prop="phone"></el-table-column>
                    <el-table-column prop="operation" label="操作" >
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteData(scope.$index, users,'users')" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <div class="block">
                        <el-pagination @current-change="handleUserPageCurrentChange" :current-page="userPage.current" :page-size="userPage.size" layout="total, prev, pager, next" :total="userPage.total" ></el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="选择菜单" :visible.sync="dialogMenusVisible">
            <searchTool :conditions="dialogMenusSearchConditions" @click="searchDialogMenus"></searchTool>
            <el-table :data="dialogMenus" border size="mini" ref="dialogMenuTable"
                      row-key="menuId" :tree-props="{children: 'subMenus'}"  :expand-row-keys="dialogMenusExpands"
                      @select-all="handleDialogMenuSelectAll" @select="handleDialogMenusSelect" @selection-change="handleDialogMenusSelectChange">
                <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
                <el-table-column property="menuName" label="菜单名称" width="150"></el-table-column>
                <el-table-column property="prodTName" label="终端" width="100"></el-table-column>
                <el-table-column label="菜单类型" prop="menuTypeName" width="100"> </el-table-column>
                <el-table-column  label="功能权限" >
                    <template slot-scope="scope">
                        <el-checkbox v-if="dialogMenusPermsShow(scope.row.menuId)" v-model="dialogPermsCopySelected[perm.permsId]" v-for="(perm,index) in scope.row.funcPerms" :key="index"  >{{perm.permsName}}</el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogMenusVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitSelectMenus">确 定</el-button>
            </span>
        </el-dialog>

        <mult-select ref="dialogPerms"
                     :search-data="searchPermsDialogConditions"
                     :selected-data="perms"
                     :id-use-equal="'permsId'"
                     :api-fun="permsApi.search"
                     :column-label="searchPermsColumn"
                     @update="submitSelectPerms"
                     :only-dialog="true"
        ></mult-select>

        <mult-select ref="dialogUsers"
                     :search-data="searchUsersConditions"
                     :selected-data="users"
                     :id-use-equal="'userId'"
                     :api-fun="userApi.searchSimple"
                     :column-label="searchUserColumn"
                     @update="submitSelectUsers"
                     :only-dialog="true"
        ></mult-select>

        <el-dialog title="添加数据权限" :visible.sync="dialogDataPermsVisible" width="30%">
            <el-form :model="dataPermsForm" :rules="dataPermsRules" ref="dataPermsForm" label-width="100px">
                <el-form-item label="数据表" prop="tableName">
                    <el-input v-model="dataPermsForm.tableName" placeholder="数据表" ></el-input>
                </el-form-item>
                <el-form-item label="字段" prop="colName">
                    <el-input v-model="dataPermsForm.colName" placeholder="字段" ></el-input>
                </el-form-item>
                <el-form-item label="限定词" prop="operation">
                    <el-select v-model="dataPermsForm.operation" placeholder="请选择限定词">
                        <el-option v-for="r in dataPermsRule" :key="r" :label="r" :value="r"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据值" prop="targetValue">
                    <el-input v-model="dataPermsForm.targetValue" placeholder="数据值" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDataPermsVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitSelectDataPerms">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Template from "../../components/searchTool/template";
    import roleApi from "../../api/system/role";
    import multSelect from "../../components/selectDialog/multSelect";
    import productApi from "../../api/system/product";
    import userApi from "../../api/system/user";
    import {Debounce} from "../../common/js/utils";
    import permsApi from '../../api/system/permission';
    import menuApi from "../../api/system/menu";
    import {deepCopy} from "../../common/js/utils";

    var dataPermsRule = [
        'StringEquals',
        'StringNotEquals',
        'StringEqualsIgnoreCase',
        'StringNotEqualsIgnoreCase',
        'StringLike',
        'StringNotLike',
        'NumericEquals',
        'NumericNotEquals',
        'NumericLessThan',
        'NumericLessThanEquals',
        'NumericGreaterThan',
        'NumericGreaterThanEquals',
        'DateEquals',
        'DateNotEquals',
        'DateLessThan',
        'DateLessThanEquals',
        'DateGreaterThan',
        'DateGreaterThanEquals'
    ];
    export default {
        name: "system-role-detail",
        components: {Template,multSelect},
        data(){
            return{
                userApi,
                permsApi,
                dataPermsRule,
                activeName:"menus",
                permsPage:{
                    size:10,
                    current:1,
                    total:0
                },
                dataPermsPage:{
                    size:10,
                    current:1,
                    total:0
                },
                userPage:{
                    size:10,
                    current:1,
                    total:0
                },
                searchMenusConditions:[
                    {field: "menuName",label: "菜单名称",input:{}},
                    {field: "menuType",label: "终端",input:{}},
                    {field: "permsName",label: "功能权限",input:{}},
                ],
                menus:[],
                searchPermsConditions:[
                    {field: "permsName",label: "功能名称",input:{}},
                    {field: "permsType",label: "权限类型",input:{}},
                    {field: "menuName",label: "关联菜单",input:{}},
                    {field: "permsCode",label: "权限编码",input:{}},
                ],
                searchRolePermsValue:[],
                perms:[],
                searchDataPermsConditions:[
                    {field: "tableName",label: "数据表",input:{}},
                ],
                searchRoleDataPermsValue:[],
                dataPerms:[],
                searchUsersConditions:[
                    {field: "loginAccount",label: "登录账号",input:{}},
                    {field: "username",label: "用户姓名",input:{}},
                    {field: "phone",label: "手机号",input:{}},
                ],
                searchRoleUsersValue:[],
                searchUserColumn:[
                    {value: "loginAccount",label: "登录账号"},
                    {value: "username",label: "用户姓名"},
                    {value: "phone",label: "手机号"},
                ],
                users:[],
                role:{
                    roleName:"",
                    roleCode:"",
                    roleType:"",
                    prodName:"",
                    standardRole:1,
                    description:""
                },
                searchPermsDialogConditions:[
                    {field: "permsName",label: "功能名称",input:{}},
                    {field: "permsType",label: "权限类型",input:{}},
                    {field: "menuName",label: "关联菜单",input:{}},
                    {field: "permsCode",label: "权限编码",input:{}},
                ],
                searchPermsColumn:[
                    {label:'功能名称',  value:'permsName'},
                    {label:'权限编码',value:'permsCode'},
                    {label:'描述',value:'description'}
                ],
                dialogDataPermsVisible:false,
                dataPermsRules:{
                    tableName: [ {required: true, message: '请输入表名', trigger: 'blur'},],
                    colName: [ {required: true, message: '请输入字段', trigger: 'blur'},],
                    operation: [ {required: true, message: '请选择限定词', trigger: 'blur'},],
                    targetValue: [ {required: true, message: '请输入数据值', trigger: 'blur'},],
                },
                dataPermsForm:{
                    tableName:"",
                    colName:"",
                    operation:"",
                    targetValue:""
                },

                dialogMenus:[],
                dialogMenusCopySelected:[],
                dialogPermsCopySelected:[],
                dialogMenusVisible:false,
                dialogMenusSearchConditions:[
                    {field: "menuName",label: "菜单名称",input:{}},
                    {field: "menuType",label: "终端",input:{}},
                    {field: "permsName",label: "功能权限",input:{}},
                ],
                dialogMenusSearchValue:{},
                products:[],
                dialogMenusExpands:[],
                menusExpands:[],

            }
        },
        activated() {
            this.roleId = this.$route.params.roleId;
            this.detail();
            this.users = [];
            this.perms = [];
            this.dataPerms = [];
            this.menus = [];
            this.activeName="menus";
            this.searchRoleMenus({});
        },
        mounted() {
            this.getProducts();
        },
        methods:{
            detail(){
                roleApi.detail(this.roleId).then(res=>{
                    this.role = res.data;
                });
            },
            searchRoleMenus(searchValue){
                if(!searchValue && this.menus.length){
                    return ;
                }
                searchValue = searchValue||{};
                let self = this;
                roleApi.searchMenus(this.roleId,100,1,searchValue).then(res=>{
                    self.menusExpands = [];
                    self.menus = [];
                    self.dialogPermsCopySelected = [];
                    self.dialogMenusCopySelected = [];
                  if(res.data){
                      self.menus = res.data.list;

                      // 处理选中数据
                      self.menus.map(res=>{
                          self.menusExpands.push(res.menuId);

                          self.dialogMenusCopySelected.push(deepCopy(res));
                          if(res.subMenus){
                              res.subMenus.map(sub=>{
                                  self.dialogMenusCopySelected.push( deepCopy(sub));
                                  if(sub.funcPerms){
                                      sub.funcPerms.map(fp=>{
                                          self.dialogPermsCopySelected[fp.permsId] = true;
                                      })
                                  }
                              })
                          }
                          if(res.funcPerms){
                              res.funcPerms.map(fp=>{
                                  self.dialogPermsCopySelected[fp.permsId] = true;
                              })
                          }
                      })
                  }
                });
            },
            searchRolePerms(searchValue){
                if(!searchValue && this.perms.length){
                    return ;
                }
                searchValue = searchValue||{};
                this.searchRolePermsValue = searchValue;
                roleApi.searchPerms(this.roleId,this.permsPage.size,this.permsPage.current,searchValue).then(res=>{
                    if(res.data){
                        this.perms = res.data.list;
                        this.permsPage.total = res.data.total;
                    }else{
                        this.perms = [];
                        this.permsPage.total = 0;
                    }
                });
            },
            handlePermsPageCurrentChange(val){
                this.permsPage.current = val;
                this.searchRoleDataPerms(this.searchRolePermsValue);
            },
            searchRoleDataPerms(searchValue){
                if(!searchValue && this.dataPerms.length){
                    return ;
                }
                searchValue = searchValue||{};
                this.searchRoleDataPermsValue = searchValue;
                roleApi.searchDataPerms(this.roleId,100,1,searchValue).then(res=>{
                    if(res.data){
                        this.dataPerms = res.data.list;
                        this.dataPermsPage.total = res.data.total;
                    }else{
                        this.dataPerms = [];
                        this.dataPermsPage.total = 0;
                    }
                });
            },
            handleDataPermsPageCurrentChange(val){
                this.dataPermsPage.current = val;
                this.searchRoleDataPerms(this.searchRoleDataPermsValue);
            },
            searchRoleUsers(searchValue){
                if(!searchValue && this.users.length){
                    return ;
                }
                searchValue = searchValue||{};
                this.searchRoleUsersValue = searchValue;
                roleApi.searchUsers(this.roleId,100,1,searchValue).then(res=>{
                    if(res.data && res.data.list){
                        this.users = res.data.list;
                        this.userPage.total = res.data.total;
                    }else{
                        this.users = [];
                        this.userPage.total = 0;
                    }
                });
            },
            handleUserPageCurrentChange(val){
                this.userPage.current = val;
                this.searchRoleUsers(this.searchRoleUsersValue);
            },
            getProducts(){
                let that = this;
                productApi.terminals().then(res=>{
                    let products = [];
                    for(let pt of res.data){
                        products.push({prodCode:pt.prodCode,prodName:pt.prodName});
                    }
                    that.products = products;

                    let defaultSearchValue = {label:that.products[0].prodName,value:that.products[0].prodCode};
                    that.searchPermsDialogConditions.push({label:"产品线",field:"prodCode",default:defaultSearchValue});
                    let min = that.dialogMenusSearchConditions.findIndex(dm=>dm.field=='prodCode');
                    if(min==-1){
                        that.dialogMenusSearchConditions.push({label:"产品线",field:"prodCode",default:defaultSearchValue})
                    }
                });
            },
            handleClick(tab, event) {
                switch (tab.name) {
                    case 'menus':
                        this.searchRoleMenus(null);
                        break;
                    case 'dataPerms':
                        this.searchRoleDataPerms(null);
                        break;
                    case 'users':
                        this.searchRoleUsers(null);
                        break;
                    case 'perms':
                        this.searchRolePerms(null);
                        break;
                }
            },
            deleteData(index, rows,type){
                this.$confirm('您确认要删除该数据?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let row =rows[index];
                    row && rows.splice(index, 1);
                    let self = this;
                    switch (type) {
                        case 'menus':
                            roleApi.deleteMenu(this.roleId,index).then(res=>{
                                if(res.status==200){
                                    self.$message.success('删除菜单成功');
                                    this.searchRoleMenus({});
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                            break;
                        case 'dataPerms':
                            roleApi.deleteDataPerms(this.roleId,row.id).then(res=>{
                                if(res.status==200){
                                    self.$message.success('删除数据权限成功');
                                    this.searchRoleDataPerms({});
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                            break;
                            break;
                        case 'users':
                            roleApi.deleteUser(this.roleId,row.userId).then(res=>{
                                if(res.status==200){
                                    self.$message.success('删除用户成功');
                                    this.searchRoleUsers({});
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                            break;
                        case 'perms':
                            roleApi.deletePerms(this.roleId,row.permsId).then(res=>{
                                if(res.status==200){
                                    self.$message.success('删除权限成功');
                                    this.searchRolePerms({});
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                            break;
                    }
                }).catch(() => {
                    self.$message.info('已取消删除');
                });
            },
            searchDialogMenus(searchValue){
                this.dialogMenus = []
                let self = this;
                this.dialogMenusSearchValue = searchValue;

                menuApi.searchMenusAddPerms(100,1,searchValue).then(res=>{
                    if(res.data && res.data.list){
                        self.dialogMenus = res.data.list;
                        // 菜单选中状态
                        self.$nextTick(()=>{
                            self.$refs.dialogMenuTable.clearSelection();
                            self.dialogMenusExpands = [];
                            // 选中的展开
                            self.dialogMenusCopySelected.map(menu=>{
                                self.dialogMenusExpands.push(menu.menuId);
                            });
                            // 设置选中
                            self.$nextTick(()=> {
                                self.dialogMenus.map(item =>{
                                    if(self.dialogMenusExpands.indexOf(item.menuId)!=-1){
                                        self.$refs.dialogMenuTable.toggleRowSelection(item,true);
                                        if(item.subMenus.length>0){
                                            item.subMenus.map((sub,index) =>{
                                                if(self.dialogMenusExpands.indexOf(sub.menuId)!=-1){
                                                    self.$refs.dialogMenuTable.toggleRowSelection(item.subMenus[index],true);
                                                }
                                            })
                                        }
                                    }
                                })
                                self.dialogMenusCopySelected.map(menu => {
                                    self.$refs.dialogMenuTable.toggleRowSelection(menu,true);
                                });
                            });
                        });
                    }
                })
            },
            showMenuAdd(){
                // 默认搜索条件
                // 先删除
                let mtIndex = this.dialogMenusSearchConditions.findIndex(m=>m.field=="menuType");
                if(mtIndex>=0){
                    this.dialogMenusSearchConditions.splice(mtIndex,1);
                }
                // 再添加
                let defaultSearchValue = {label:this.role.roleTypeName,value:this.role.roleType};
                this.dialogMenusSearchConditions.push({label:"类型",field:"menuType",default:defaultSearchValue})
                this.dialogMenusSearchValue.menuType = this.role.roleType;

                let defaultSearchValue2 = {label:this.role.prodName,value:this.role.prodCode};
                let min = this.dialogMenusSearchConditions.findIndex(m=>m.field=="prodCode");
                if(min==-1){
                    this.dialogMenusSearchConditions.push({label:"产品线",field:"prodCode",default:defaultSearchValue2})
                    this.dialogMenusSearchValue.prodCode = this.role.prodCode;
                }

                this.dialogMenusVisible = true;

                this.dialogMenusCopySelected = deepCopy(this.menus);
                for(let m of this.menus){
                    if(m.subMenus){
                        for(let sm of m.subMenus){
                            this.dialogMenusCopySelected.push(deepCopy(sm));
                        }
                    }
                }
                this.searchDialogMenus(this.dialogMenusSearchValue);
            },
            showPermsAdd(){
                this.$refs["dialogPerms"].showDialog();
            },
            showDataPermsAdd(){
                this.dialogDataPermsVisible = true;
                this.dataPermsForm = {
                    tableName:"",
                    colName:"",
                    operation:"",
                    targetValue:""
                }
            },
            showUsersAdd(){
                this.$refs["dialogUsers"].showDialog();
            },
            handleDialogMenusSelect(selected,row) {
                console.log(selected);
                this.dialogMenusCopySelected = deepCopy(selected);
                let index = this.dialogMenusCopySelected.findIndex(item =>item.menuId==row.menuId);
                let v = index!=-1;
                if(row.funcPerms){
                    row.funcPerms.map(fp=>{
                        this.dialogPermsCopySelected[fp.permsId] = v;
                    })
                }
                console.log(v);
                // 子菜单
                if(row.subMenus){
                    row.subMenus.map(res=>{
                        console.log(res.menuId+":"+v);
                        this.$refs.dialogMenuTable.toggleRowSelection(res,v);
                        if(v){
                            this.dialogMenusCopySelected.push(res) ;
                        }else{
                            let rindex = this.dialogMenusCopySelected.findIndex(item =>item.menuId==res.menuId);
                            this.dialogMenusCopySelected.splice(rindex,1);
                        }
                        if(res.funcPerms){
                            res.funcPerms.map(fp=>{
                                this.dialogPermsCopySelected[fp.permsId] = v;
                            })
                        }
                    });
                }

                // 展开
                if (v) {
                    this.dialogMenusExpands.push(row.menuId);
                }else{
                    let index = this.dialogMenusExpands.findIndex(item =>item==row.menuId);
                    if(index!=-1){
                        this.dialogMenusExpands.splice(index,1);
                    }
                }

            },
            handleDialogMenusSelectChange(sel){
                console.log(sel);
                this.$forceUpdate();
            },
            dialogMenusPermsShow(menuId){
                let index = this.dialogMenusCopySelected.findIndex(item =>item.menuId==menuId);
                return index!=-1;
            },
            handleDialogMenuSelectAll(selected){
                if(selected.length){
                    selected.map(one=>{
                        this.handleDialogMenusSelect(selected,one);
                    });
                }else{
                    this.dialogMenus.map(one=>{
                        this.handleDialogMenusSelect(selected,one);
                    });
                    this.dialogMenusExpands = [];
                }
            },
            submitSelectDataPerms:Debounce(function () {
                let self = this;
                self.$refs['dataPermsForm'].validate((valid) => {
                    if (valid) {
                        roleApi.createDataPerms(this.roleId,self.dataPermsForm).then(res=>{
                            if(res.status==200){
                                self.$message.success('添加数据权限成功');
                                self.dialogDataPermsVisible = false;
                                this.searchRoleDataPerms({});
                            }else{
                                res.message && self.$message.error(res.message);
                            }
                        });
                    }
                });
            },1000),
            submitSelectMenus(){

                this.dialogMenusVisible = false;
                let params = [];
                for(let m of this.dialogMenusCopySelected){
                    if(m && m.menuId){
                        let p = {menuId:m.menuId,permsIds:[]};
                        if(m.funcPerms){
                            for(let f of m.funcPerms){
                                if(this.dialogPermsCopySelected[f.permsId]){
                                    p.permsIds.push(f.permsId);
                                }
                            }
                        }
                        params.push(p);
                    }
                }
                let self = this;
                roleApi.bindMenus(this.roleId,params).then(res=>{
                    if(res.status==200){
                        self.$message.success('添加菜单权限成功');
                        this.searchRoleMenus({});
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                })

            },
            submitSelectPerms(perms){
                this.perms = perms;
                let param = {permsIds:[]};
                if(perms){
                    for(let u of perms){
                        param.permsIds.push(u.permsId);
                    }
                }
                let self = this;
                roleApi.bindPerms(this.roleId,param).then(res=>{
                    if(res.status==200){
                        self.$message.success('添加功能权限成功');
                        this.searchRolePerms({});
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                })
            },
            submitSelectUsers(users){
                this.users = users;
                let param = {userIds:[]};
                if(users){
                    for(let u of users){
                        param.userIds.push(u.userId);
                    }
                }
                let self = this;
                roleApi.bindUsers(this.roleId,param).then(res=>{
                    if(res.status==200){
                        self.$message.success('添加用户成功');
                        this.searchRoleUsers({});
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                })
            },
        },filters: {
            filterPermsType(val){
                if (0==val) return '私有权限';
                if (1==val) return '公有权限';
                return val;
            }
        }
    }
</script>

<style scoped lang="scss">
.system-role-detail .el-tag{
        margin-right: 5px;
}
</style>
