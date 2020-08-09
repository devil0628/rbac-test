<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions"  @click="doSearch"></searchTool>
            <div>
                <el-button type="primary" @click="showDrawerAdd" >新增权限</el-button>
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
                <el-table-column label="权限编码" prop="permsCode" width="200"></el-table-column>
                <el-table-column label="功能名称" prop="permsName" width="250"></el-table-column>
                <el-table-column label="权限类型" prop="permsType" width="100">
                    <template slot-scope="scope">{{scope.row.permsType | filterPermsType}}</template>
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
                <el-table-column label="关联菜单" prop="menus" >
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
                <el-table-column label="版本号" prop="versionCode" width="80"></el-table-column>
                <el-table-column label="产品线" prop="prodName" width="100"></el-table-column>
                <el-table-column label="引用角色" width="100">
                    <template slot-scope="scope">
                        <el-popover  placement="top-start"  trigger="hover" >
                            <p v-for="role in scope.row.roles">{{ role.roleName }}</p>
                            <div slot="reference" class="name-wrapper content-limit">
                                <span slot="reference">{{scope.row.roleNums?scope.row.roleNums:"0"}}</span>
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
            <el-form :model="perm" :rules="rules" ref="perm" label-width="100px">
                <el-form-item label="权限编码" prop="permsCode" >
                    <el-input v-model="perm.permsCode" placeholder="请输入权限编码" ></el-input>
                </el-form-item>
                <el-form-item label="功能名称" prop="permsName" >
                    <el-input v-model="perm.permsName" placeholder="请输入功能名称" ></el-input>
                </el-form-item>
                <el-form-item label="描述" >
                    <el-input type="textarea" v-model="perm.description" placeholder="请输入描述" ></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="权限类型" prop="permsType" >
                            <el-select v-model="perm.permsType" placeholder="请选择类型">
                                <el-option label="私有权限" value="0"></el-option>
                                <el-option label="公用权限" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品线" prop="prodCode" >
                            <el-select v-model="perm.prodCode" placeholder="请选择产品线">
                                <el-option v-for="prod in products" :key="prod.prodCode" :label="prod.prodName" :value="prod.prodCode"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="权限内容">
                    <el-button @click.native.prevent="addPermMethod(perm.scripts)" type="text" size="small" class="right">+ 新增</el-button>
                    <el-table :data="perm.scripts" size="small" border>
                        <el-table-column label="method" width="120">
                            <template slot-scope="scope">
                            <el-select v-model="scope.row.method" placeholder="method" size="small">
                                <el-option label="ALL" value="ALL"></el-option>
                                <el-option label="GET" value="GET"></el-option>
                                <el-option label="POST" value="POST"></el-option>
                                <el-option label="PUT" value="PUT"></el-option>
                                <el-option label="DELETE" value="DELETE"></el-option>
                            </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="path" prop="path" min-width="200px">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.path" placeholder="请输入" size="small" ></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deletePermMethod(scope.$index, perm.scripts)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="按钮" prop="button" >
                            <el-switch v-model="perm.button"  :active-value="1" :inactive-color="'0'"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="版本号" prop="versionCode">
                            <el-input v-model="perm.versionCode" placeholder="请输入版本号" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="关联菜单" >
                    <mult-select ref="menuDialog"
                                 :search-data="menuSearchCondition"
                                 :selected-data="perm.menus"
                                 :id-use-equal="'menuId'"
                                 :api-fun="menuApi.searchSimple"
                                 :column-label="menuColumn"
                                 @update="updateMenu"

                    ></mult-select>
                </el-form-item>
                <el-form-item >
                    <el-button @click.native.prevent="drawerEdit = false" >取消</el-button>
                    <el-button @click.native.prevent="submitEdit()" type="primary" >保存</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <!-- 详情页 -->
        <el-drawer :visible.sync="drawerDetail" :with-header="false"  size="40%">
            <div class="flex-between p20">
                <span>{{drawTitle}}</span>
                <span><i class="el-icon-close"></i></span>
            </div>
            <el-tabs v-model="activeDetail" type="card" >
                <el-tab-pane label="基本详情" name="perm">
                    <el-form label-width="100px">
                        <el-row><el-col :span="12">
                                <el-form-item label="权限编码">{{perm.permsCode}} </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="功能名称"> {{perm.permsName}}</el-form-item></el-col>
                        </el-row>
                        <el-form-item label="描述" >{{perm.description}}</el-form-item>
                        <el-row>
                        <el-col :span="12">
                            <el-form-item label="权限类型">{{perm.permsType=="0"?"私有权限":"公用权限"}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品线">{{perm.prodName}}</el-form-item>
                        </el-col>
                        </el-row>
                        <el-form-item label="权限内容" >
                            <el-table :data="perm.scripts" size="small" border>
                                <el-table-column label="method" prop="method"></el-table-column>
                                <el-table-column label="path" prop="path" min-width="200px"></el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item label="按钮">{{perm.button?"是":"否"}}</el-form-item>
                        <el-form-item label="版本号">{{perm.versionCode}}</el-form-item>
                        <el-form-item label="关联菜单" >
                            <el-table :data="perm.menus" size="small" border>
                                <el-table-column label="父级菜单" prop="parentMenuName"></el-table-column>
                                <el-table-column label="菜单名称" prop="menuName"></el-table-column>
                                <el-table-column label="菜单类型" prop="menuTypeName"></el-table-column>
                                <el-table-column label="终端" prop="prodTName"></el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="引用角色" name="role">
                    <el-table :data="perm.roles" size="small" border>
                        <el-table-column label="角色名称" prop="roleName"></el-table-column>
                        <el-table-column label="角色类型" prop="roleType"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <el-button @click.native.prevent="drawerDetail = false" style="margin: 10px 30px">返回</el-button>
        </el-drawer>
    </div>
</template>

<script>
    import permsApi from '../../api/system/permission';
    import productApi from '../../api/system/product';
    import menuApi from '../../api/system/menu';
    import multSelect from "../../components/selectDialog/multSelect";
    import {Debounce} from "../../common/js/utils";

    export default {
        name: "system-permission",
        components:{
            multSelect
        },
        data(){
            return{
                menuApi,
                page:{
                    size:10,
                    current:1,
                    total:0
                },
                drawerEdit:false,//编辑页
                drawerDetail:false,//详情页
                drawTitle:'新增权限',
                tableData:[],// 列表数据
                searchConditions:[// 搜索条件
                    {field: "permsName",label: "功能名称",input:{}},
                    {field: "permsType",label: "权限类型",select:{multi:false,items:[{label:"私有权限",value:"0"},{label:"公有权限",value:"1"}]}},
                    {field: "description",label: "描述",input:{}},
                    {field: "menuName",label: "关联菜单",input:{}},
                    {field: "prodCode",label: "产品线",select:{multi:false,items:[]}},
                    {field: "versioncode",label: "版本号",input:{}},
                ],
                perm:{
                    permsCode:"",
                    permsName:"",
                    permsType:"0",
                    description:"",
                    versionCode:"",
                    prodCode:"",
                    scripts:[
                        {method:"GET",path:""},
                        {method:"POST",path:""},
                    ],
                    button:0,
                    roles:[],
                    menus:[]
                },
                rules: {
                    permsCode: [ {required: true, message: '请输入权限编码', trigger: 'blur'},],
                    permsName: [ {required: true, message: '请输入功能名称', trigger: 'blur'},],
                    permsType: [ {required: true, message: '请选择类型', trigger: 'blur'},],
                    versionCode: [ {required: true, message: '请选择版本号', trigger: 'blur'},],
                    prodCode: [ {required: true, message: '请选择产品线', trigger: 'blur'},],


                },
                products:[],//产品线
                activeDetail:"perm",
                menuColumn:[
                    {label:'父级菜单',value:'parentMenuName'},
                    {label:'菜单名称',value:'menuName'},
                    {label:'菜单类型',value:'menuTypeName'},
                    {label:'终端',value:'prodTName'}
                ],
                menuSearchCondition:[
                    {field: "menuName",label: "菜单名称",input:{}},
                ],
                searchValue:[],

            }
        },
        mounted() {
            // 获取table数据
            // 获取产品线 products
            this.doSearch({});
            this.getProducts();
        },
        methods:{
            doSearch(searchValue){
                let that = this;
                that.searchValue = searchValue;
                permsApi.search(this.page.size,this.page.current,searchValue).then(res=>{
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
                    let searchSelect = []
                    for(let pt of res.data){
                        products.push({prodCode:pt.prodCode,prodName:pt.prodName});
                        searchSelect.push({label:pt.prodName,value:pt.prodCode});
                    }
                    that.products = products;
                    if(products.length){
                        that.perm.prodCode=products[0].prodCode;
                    }

                    let defaultSearchValue = {label:that.products[0].prodName,value:that.products[0].prodCode};
                    that.menuSearchCondition.push({label:"产品线",field:"prodCode",default:defaultSearchValue})

                    that.searchConditions[4].select.items=searchSelect;
                });
            },
            showDrawerAdd(){
                this.drawTitle = "新增权限";
                this.drawerEdit = true;
                this.$refs['perm'] && this.$refs['perm'].clearValidate();
                this.perm = {
                    permsCode:"",
                    permsName:"",
                    permsType:"0",
                    description:"",
                    versionCode:"",
                    scripts:[
                        {method:"GET",path:""},
                        {method:"POST",path:""},
                    ],
                    button:0,
                    roles:[],
                    menus:[]
                }
                if(this.products.length){
                    this.perm.prodCode=this.products[0].prodCode;
                }
            },
            showEdit(perm){
                this.drawTitle = "修改权限";
                this.drawerEdit = true;
                let that = this;
                this.$refs['perm'] && this.$refs['perm'].clearValidate();
                permsApi.detail(perm.permsId).then(res=>{
                    that.perm = res.data;
                    that.perm.permsType = that.perm.permsType+"";
                });
            },
            showDetail(perm){
                this.drawTitle = "权限详情";
                this.drawerDetail = true;
                let that = this;
                permsApi.detail(perm.permsId).then(res=>{
                    that.perm = res.data;
                    that.perm.permsType = that.perm.permsType+"";
                    for (let p of that.products){
                        if(p.prodCode==that.perm.prodCode){
                            that.perm.prodName =p.prodName;
                            break;
                        }
                    }

                });
            },
            deleteOne(perm){
                let self = this;
                self.$confirm('您确认要删除该权限?', '删除提醒', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    permsApi.detail(perm.permsId).then(res=>{
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
            deletePermMethod(index, rows){
                rows.splice(index, 1);
            },
            addPermMethod(rows){
                rows.push({method:"GET",path:""},);
            },
            submitEdit:Debounce(function () {
                let self = this;
                self.$refs['perm'].validate((valid) => {
                    if (valid) {
                        if(self.perm.button){
                            self.perm.button = 1;
                        }else{
                            self.perm.button = 0;
                        }
                        let menus = self.perm.menus;
                        //self.perm.menus = [];
                        if (self.perm.permsId) {
                            permsApi.update(self.perm.permsId, self.perm).then(res=>{
                                if(res.status==200){
                                    self.$message.success('修改成功');
                                    self.submitPermMenus(self.perm.permsId,menus);
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                        } else {
                            permsApi.create(self.perm).then(res=>{
                                if(res.status==200){
                                    self.$message.success('添加成功');
                                    self.submitPermMenus(res.data.permsId,menus);
                                }else{
                                    res.message && self.$message.error(res.message);
                                }
                            });
                        }
                    }
                });
            },1000),
            submitPermMenus(permsId,menus){
                let params = {menuIds:[]};
                for(let m of menus){
                    params.menuIds.push(m.menuId);
                }
                let self = this;
                permsApi.bindMenus(permsId,params).then(res=>{
                    if(res.status==200){
                        self.drawerEdit = false;
                        self.doSearch(self.searchValue);
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                });
            },
            updateMenu(arr){
                this.perm.menus = arr;
            }
        },
        filters: {
            filterPermsType(val){
                if (0==val) return '私有权限';
                if (1==val) return '公有权限';
                return val;
            }
        }
    }
</script>

<style scoped>

</style>
