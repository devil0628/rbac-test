<template>
    <div>
        <div class="flex-between pr20">
            <searchTool :conditions="searchConditions" @click="doSearch"></searchTool>
            <div>
            <el-select v-model="searchProdCode" @change="searchProductSelectChange">
                <el-option v-for="item in products" :key="item.prodCode" :label="item.prodName" :value="item.prodCode" ></el-option>
            </el-select>
            <el-select v-model="searchMenuType" @change="searchMenuTypeSelectChange">
                <el-option label="全部" value="" ></el-option>
                <el-option v-for="item in menuTypeList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                <el-option v-for="item in orgTypes" :key="item.orgTypeCode" :label="item.orgTypeName" :value="item.orgTypeCode" ></el-option>
            </el-select>
            </div>
            <div>
                <el-button type="primary" @click="showRight" >新增菜单</el-button>
            </div>
        </div>

        <el-row>
            <el-table :data="tableData" row-key="menuId" :tree-props="{children: 'subMenus'}" size="mini" :expand-row-keys="expands">
                <el-table-column label="菜单名称" prop="menuName" width="150"></el-table-column>
                <el-table-column label="排序" prop="sort" width="50">
                    <template slot-scope="scope">
                        <el-button type="text" @click="setMenuSort(scope.row)">{{scope.row.sort}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="菜单类型" prop="menuTypeName" width="100"> </el-table-column>
                <el-table-column label="产品线" prop="prodName" width="150"></el-table-column>
                <el-table-column label="终端" prop="prodTName" width="150"></el-table-column>
                <el-table-column label="地址" prop="address"></el-table-column>
                <el-table-column label="地址类型" prop="addressType" width="70"></el-table-column>
                <el-table-column label="启用" prop="enabled" width="50">
                    <template slot-scope="scope">
                        <el-button type="text" @click="setEnabledStatus(scope.row)">{{scope.row.enabled?'是':'否'}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="适用范围">
                    <template slot-scope="scope">{{scope.row | filterRange}}</template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="280px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editMenuOne(scope.row,true)">详情</el-button>
                        <el-button type="text" @click="editMenuOne(scope.row,false)">编辑</el-button>
                        <el-button type="text" @click="delMenuOne(scope.row)">删除</el-button>
                        <el-button type="text"  @click="showPermsDialog(scope.row)">权限分配</el-button>
                        <el-button type="text" @click="addChildMenu(scope.row)" v-if="!scope.row.parentMenuId">新增子菜单</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-row>
        <el-drawer id="menuEditDrawer" :title="drawTitle" :visible.sync="drawer" :with-header="false" size="40%">
            <div class="flex-between p20 drawer-head">
                <span>{{drawTitle}}</span>
                <span> <i @click="drawer=false" class="el-icon-close"></i> </span>
            </div>
                    <el-form  :model="menuForm" :rules="menuRules" label-width="120px" ref="menuForm">
                        <el-row>
                        <el-form-item label="上级菜单" prop="parentMenuId" v-if="menuForm.parentMenuId">
                            <el-input v-model="menuForm.parentMenuName" disabled ></el-input>
                        </el-form-item>
                        <el-form-item label="菜单名称" prop="menuName">
                            <el-input v-model="menuForm.menuName" :disabled="isDetail"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-radio-group v-model="menuForm.menuType" :disabled="isDetail">
                                <el-radio v-for="(rad,index) in menuTypeList" :key="rad.value" :label="rad.value">{{rad.label}}</el-radio>
                                <el-radio v-for="(rad,index) in orgTypes" :key="rad.orgTypeCode" :label="rad.orgTypeCode">{{rad.orgTypeName}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="产品线" prop="prodCode">
                                    <el-select v-model="menuForm.prodCode" @change="productSelectChange" :disabled="isDetail">
                                        <el-option v-for="item in products" :key="item.prodCode" :label="item.prodName" :value="item.prodCode" ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="终端" prop="prodTCode">
                                    <el-select v-model="menuForm.prodTCode" :disabled="isDetail">
                                        <el-option v-for="item in terminals" :key="item.prodTCode" :label="item.prodTName" :value="item.prodTCode" ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="地址类型" prop="addressType">
                                    <el-select v-model="menuForm.addressType" :disabled="isDetail">
                                        <el-option v-for="(sel,index) in addressTypeList"
                                                   :key="index"
                                                   :label="sel.label"
                                                   :value="sel.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="Target" prop="target">
                                    <el-select v-model="menuForm.target" :disabled="isDetail">
                                        <el-option v-for="(sel,index) in targetList"
                                                   :key="index"
                                                   :label="sel.label"
                                                   :value="sel.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="地址" prop="address">
                               <el-input v-model="menuForm.address" :disabled="isDetail"></el-input>
                        </el-form-item>
                        <el-form-item label="适用范围" v-if="menuForm.menuType!='SYSTEM' && menuForm.menuType!='PLATFORM' " prop="copyUseRange">
                            <el-radio-group v-model="menuForm.copyUseRange" @change="clearSelected" :disabled="isDetail">
                                <el-radio :label="1">全部</el-radio>
                                <el-radio :label="2">租户</el-radio>
                                <el-radio :label="3" v-if="menuForm.menuType!='TENANT'">机构</el-radio>
                            </el-radio-group>
                            <div v-if="menuForm.copyUseRange==2" >
                                <mult-select ref="tenantDialog"
                                             :search-data="tenantSearchCondition"
                                             :selected-data="tenantSelected"
                                             :id-use-equal="'tenantId'"
                                             :api-fun="tenantApi.search"
                                             :column-label="tenantColumn"
                                             @update="updateTenant"

                                ></mult-select>
                            </div>
                            <div v-if="menuForm.copyUseRange==3" >
                                <mult-select ref="orgDialog"
                                             :search-data="orgSearchCondition"
                                             :selected-data="orgSelected"
                                             :id-use-equal="'orgId'"
                                             :api-fun="orgApi.search"
                                             :column-label="orgColumn"
                                             @update="updateOrg"

                                ></mult-select>
                            </div>
                        </el-form-item>
                        <el-col :span="12">
                            <el-form-item label="启用" prop="enabled">
                                    <el-switch  v-model="menuForm.enabled" :active-value="1" :inactive-color="'0'" :disabled="isDetail"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序" prop="sort">
                                <el-input v-model="menuForm.sort" :disabled="isDetail"></el-input>
                            </el-form-item>
                        </el-col>
                        </el-row>
                        <el-form-item label="权限" v-if="isDetail">
                            <el-table :data="permsSelected" size="mini" border>
                                <el-table-column v-for="(column,index) in permsColumn"  :key="index"
                                                 :label="column.label"
                                                 :prop="column.value"
                                ></el-table-column>
                            </el-table>
                         </el-form-item>
                        <el-form-item >
                            <el-button @click="drawer = false">取 消</el-button>
                            <el-button type="primary" @click="submitFormData" v-if="!isDetail">保存</el-button>
                        </el-form-item>
                    </el-form>
        </el-drawer>

        <el-dialog title="设置排序" :visible.sync="editSortDialog"  width="30%" >
            <span>
                <el-input v-model="editSortMenu.sort" type="number"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editSortDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitEditSort">确 定</el-button>
            </span>
        </el-dialog>

        <mult-select ref="permsDialog"
                     :search-data="permsSearchCondition"
                     :selected-data="permsSelected"
                     :id-use-equal="'permsId'"
                     :api-fun="permsApi.searchSimple"
                     :column-label="permsColumn"
                     :only-dialog="true"
                     @update="updatePerms"

        ></mult-select>
    </div>
</template>

<script>
    import { Loading } from 'element-ui';
    //api
    import menuApi from "../../api/system/menu";
    //utils
    import {Debounce,objKeyFilter} from "../../common/js/utils";
    //components
    import multSelect from "../../components/selectDialog/multSelect";
    import productApi from "../../api/system/product";
    import orgTypeApi from "../../api/system/orgType";
    import orgApi from "../../api/system/org";
    import tenantApi from "../../api/system/tenant";
    import permsApi from "../../api/system/permission";

    var menuTypes = [  //菜单类型
        {label:'系统', value:'SYSTEM'},
        {label:'平台',value:'PLATFORM'},
        {label:'租户',value:'TENANT'},
        {label:'机构', value:'ORG'},
    ];
    var addressTypeList = [
        {label:'VUE',value:'VUE'},
        {label:'HTTP',value:'HTTP'},
        {label:'iframe',value:'IFRAME'},
        {label:'CODE', value:'CODE'},
    ]

    export default {
        name: "system-menu-default",
        components:{
            multSelect
        },
        data(){
            return{
                tenantApi,
                orgApi,
                permsApi,
                searchProdCode:"",
                searchMenuType:"",
                searchConditions:[
                    {field: "menuName",label: "菜单名称",input:{}},
                    {field: "prodTCode",label: "业务终端",select:{multi:false,items:[]}},
                    {field: "addressType",label: "地址类型",select:{multi:false,items:addressTypeList}},
                    {field: "enabled",label: "启用状态",select:{multi:false,items:[{label:'启用',value:1},{label: '禁用',value:0}]}},
                ],
                addressTypeList:addressTypeList,
                tableData:[],
                targetList:[//_self,_blank,_parent,_top
                    {label:'_self', value:'_self'},
                    {label:'_blank', value:'_blank'},
                    {label:'_parent', value:'_parent'},
                    {label:'_top', value:'_top'}
                ],
                menuRules:{
                    menuName:[
                        { required: true, message: '请输入菜单名称', trigger: 'blur' },
                    ],
                    menuType:[
                        { required: true, message: '请选择菜单类型', trigger: 'blur' },
                    ],
                    sort:[
                        { required: true, message: '请输入排序名称', trigger: 'blur' },
                    ],
                    prodCode:[
                        { required: true, message: '请选择产品线', trigger: 'blur' },
                    ],
                    prodTCode:[
                        { required: true, message: '请选择产品线终端', trigger: 'blur' },
                    ],
                    addressType:[
                        { required: true, message: '请选择地址类型', trigger: 'blur' },
                    ],
                    target:[
                        { required: true, message: '请选择target类型', trigger: 'blur' },
                    ],
                },
                drawer:false,
                drawTitle:'新增菜单',
                menuTypeList:menuTypes,
                menuForm:{
                    menuId:null,
                    parentMenuId:null,
                    parentMenuName:'',
                    menuName:'',
                    menuType: 'SYSTEM',
                    sort:1,
                    address:'',
                    addressType: 'VUE',
                    target:'_self',
                    prodTCode:null,  //终端编码
                    prodCode:null,  //铲平线编码
                    enabled:1,
                    copyUseRange:1    //使用范围,这边要与提交的数据进行处理
                },
                orgSearchCondition:[  //以下是机构和企业的弹窗所需要的
                    {field: "orgName",label: "机构名称",input:{}},
                ],
                orgSelected:[],
                orgColumn:[
                    {label:'机构名称',value:'orgName'},
                    {label:'负责人',value:'principal'},
                    {label:'联系电话',value:'phone'}
                ],
                tenantSearchCondition:[
                    {field: "tenantName",label: "企业名称",input:{}},
                ],
                tenantSelected:[],
                tenantColumn:[
                    { label:'企业名称',  value:'tenantName'},
                    {label:'负责人',value:'principal'},
                    {label:'联系电话',value:'phone'}
                ],
                permsSearchCondition:[
                    {field: "permsName",label: "功能名称",input:{}},
                    {field: "permsCode",label: "权限编码",input:{}},
                ],
                permsSelected:[],
                permsColumn:[
                    {label:'功能名称',  value:'permsName'},
                    {label:'权限编码',value:'permsCode'},
                    {label:'描述',value:'description'}
                ],
                products:[],
                terminals:[],
                productTerminals:[],
                orgTypes:[],
                isEdit:false,
                isDetail:false,
                expands:[],// 展开
                nowExpandMenuId:"",// 展开用
                editSortDialog:false,
                editSortMenu:{},
                nowAssignPermMenuId:""
            }
        },
        mounted() {
            this.getProducts();
            this.getOrgTypes();
            this.doSearch({});
        },
        methods:{
            //search
            doSearch(searchValue){
                // 必须选中
                if(this.searchProdCode){
                    if(!searchValue){
                        searchValue = {}
                    }
                    searchValue["menuType"] = this.searchMenuType;
                    searchValue["prodCode"] = this.searchProdCode;
                    let that = this;
                    menuApi.getMenuData(1000,1,searchValue).then(res =>{
                        that.tableData = [];
                        if(res.data){
                            that.tableData = res.data.list;
                        }
                        let ptSearchMap = {};
                        for(let d of res.data.list){
                            ptSearchMap[d.prodTCode] = {label:d.prodTName,value:d.prodTCode};
                        }
                        let ptSearchArray = [];
                        for(let d in ptSearchMap){
                            ptSearchArray.push(ptSearchMap[d]);
                        }
                        that.searchConditions[1].select.items=ptSearchArray;

                        if(that.nowExpandMenuId){
                            // 展开
                            that.expands = [];
                            that.expands.push(that.nowExpandMenuId)
                        }
                    })
                }
            },
            //表格操作
            delMenuOne(menu){
                let self = this;
                this.$confirm('<h3>菜单删除后，请同步删除资源文件，避免菜单重名造成影响。</h3><span>菜单删除后，用户需要退出登录后才可生效。</span>','确认删除',{
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() =>{
                    menuApi.delMenuById(menu.menuId).then(res =>{
                        this.$message.success('删除成功');

                        self.nowExpandMenuId = menu.parentMenuId;
                        // 刷新列表
                        self.doSearch(self.searchValue);

                    })
                }).catch(() =>{
                    self.$message.info('已取消删除');
                })
            },
            setMenuSort(menu){// 设置排序
                this.editSortMenu = menu;
                this.editSortDialog = true;
            },
            submitEditSort(){
                let menu = this.editSortMenu;
                menu.editType = 1;
                let self = this;
                menuApi.editMenu(menu.menuId,menu).then(res=>{
                    if(res.status==200){
                        self.$message.success("成功设置");
                        self.editSortDialog = false;

                        self.nowExpandMenuId = menu.parentMenuId;
                        // 刷新列表
                        self.doSearch(self.searchValue);
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                });
            },
            setEnabledStatus(menu){// 设置启用
                let self = this;
                if(menu.enabled==1){
                    this.$confirm('<h3>菜单禁用后，终端将不显示该菜单。</h3><span>菜单禁用后，用户需要退出登录后才可生效。</span>','确认禁用',{
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    }).then(() =>{
                        menu.editType = 2;
                        menu.enabled = 0;
                        menuApi.editMenu(menu.menuId,menu).then(res=>{
                            if(res.status==200){
                                self.$message.success("成功禁用");
                            }else{
                                res.message && self.$message.error(res.message);
                            }
                        });
                        //self.nowExpandMenuId = menu.parentMenuId;
                        // 刷新列表
                        //self.doSearch(self.searchValue);
                    }).catch(() =>{
                    })
                }else {
                    menu.editType = 2;
                    menu.enabled = 1;
                    menuApi.editMenu(menu.menuId,menu).then(res=>{
                        if(res.status==200){
                            self.$message.success("成功启用");
                        }else{
                            res.message && self.$message.error(res.message);
                        }
                    });
                }
            },
            //编辑先获取详情
            editMenuOne(row,isDetail){
                this.isEdit = true;
                this.isDetail = isDetail;
                this.$refs['menuForm'] && this.$refs['menuForm'].clearValidate();
                let self = this;
                menuApi.getMenuById(row.menuId).then(res =>{ //数据进行赋值
                    Object.assign(self.menuForm, objKeyFilter(self.menuForm, res.data));  //剔除一些没用的字段
                    if(res.data.useRangeIsAll){
                        self.menuForm.copyUseRange = 1;
                    }else if(res.data.useRanges){
                        self.menuForm.copyUseRange = res.data.useRanges[0].type;
                    }
                    self.drawer = true;
                    self.$nextTick(()=>{
                        if(self.menuForm.copyUseRange==2){
                            self.tenantSelected=res.data.useRanges;
                        }else if(self.menuForm.copyUseRange==3){
                            self.orgSelected=res.data.useRanges;
                        }else{
                            self.tenantSelected = [];
                            self.orgSelected = [];
                        }
                    });
                });
                if(this.isDetail){
                    let perms = {menuId:row.menuId};
                    permsApi.search(1000,1,perms).then(res=>{
                        if(res.status==200){
                            self.permsSelected = res.data.list;
                        }
                    });
                }
            },
            addChildMenu(row){
                this.showRight();
                this.$nextTick(() =>{
                    this.menuForm.parentMenuName = row.menuName;
                    this.menuForm.parentMenuId = row.menuId;
                })
            },
            //右边draw
            showRight(){
                this.isEdit = false;
                this.isDetail = false;
                this.drawer = true;
                this.$refs['menuForm'] && this.$refs['menuForm'].clearValidate();
                this.menuForm = {
                    parentMenuId:null,
                    parentMenuName:'',
                    menuName:'',
                    menuType: 'SYSTEM',
                    sort:1,
                    address:'',
                    addressType: 'VUE',
                    target:'_self',
                    prodTCode:null,  //终端编码
                    prodCode:null,  //铲平线编码
                    enabled:1,
                    copyUseRange:1    //使用范围,这边要与提交的数据进行处理
                };
            },
            clearSelected(){
                this.orgSelected = [];
                this.$refs['orgDialog'] && this.$refs['orgDialog'].clearSelected();

                this.tenantSelected = [];
                this.$refs['tenantDialog'] && this.$refs['tenantDialog'].clearSelected();
            },
            updateOrg(arr){
                this.orgSelected = arr;
            },
            updateTenant(arr){
                this.tenantSelected = arr;
            },
            showPermsDialog(menu){
                let perms = {menuId:menu.menuId};
                let self = this;
                self.permsSelected = [];
                self.nowAssignPermMenuId = menu.menuId;
                permsApi.search(1000,1,perms).then(res=>{
                    if(res.status==200){
                        self.permsSelected = res.data.list;
                        self.$refs["permsDialog"].showDialog();
                    }
                });
            },
            updatePerms(arr){
                let perms = {permsIds:[],menuId:this.nowAssignPermMenuId};
                if(arr && arr.length){
                    for (let a of arr){
                        perms.permsIds.push(a.permsId);
                    }
                }
                let self = this;
                menuApi.assignPerms(this.nowAssignPermMenuId,perms).then(res=>{
                    if(res.status==200){
                        self.$message.success("权限分配成功");
                    }else{
                        res.message && self.$message.error(res.message);
                    }
                });
            },
            submitFormData:Debounce(function () {
                //
                let loadingInstance = Loading.service({target:document.querySelector('#menuEditDrawer')});
                let self = this
                self.$refs['menuForm'].validate((valid) => {
                    if (valid) {
                        let menuForm = self.menuForm;
                        if(menuForm.menuId){
                            menuApi.editMenu(menuForm.menuId,menuForm).then(res=>{
                                if (res.status != 200) {
                                    res.message && self.$message.error(res.message);
                                }else {
                                    self.submitUserRange(menuForm.menuId,menuForm.parentMenuId);
                                }
                            });
                        }else{
                            menuForm.editType = 0;
                            menuApi.addMenu(menuForm).then(res=>{
                                if (res.status != 200) {
                                    res.message && self.$message.error(res.message);
                                }else{
                                    let menuId = res.data.menuId;
                                    self.submitUserRange(menuId,menuForm.parentMenuId);
                                }

                            });
                        }
                    }
                    this.$nextTick(() => {
                        loadingInstance.close();
                    });
                });
            },1000),
            submitUserRange(menuId,pmenuId){
                let orgIds = [];
                let tenantIds = [];
                if(this.orgSelected && this.orgSelected.length){
                    for(let i of this.orgSelected){
                        orgIds.push(i.orgId);
                    }
                }
                if(this.tenantSelected && this.tenantSelected.length){
                    for(let i of this.tenantSelected){
                        tenantIds.push(i.tenantId);
                    }
                }
                let useRange = {useRange:this.menuForm.copyUseRange,tenantIds:tenantIds,orgIds:orgIds};
                let that = this;
                menuApi.updateUserRange(menuId,useRange).then(res=>{
                    console.log(res);
                    if (res.status == 200) {
                        that.$message.success((that.isEdit ? '修改' : '添加') + '成功');
                        that.drawer = false;

                        that.nowExpandMenuId = pmenuId;
                        // 刷新列表
                        that.doSearch({});
                    } else {
                        res.message && that.$message.error(res.message);
                    }
                });
            },
            getProducts(){
                let that = this;
                productApi.terminals().then(res=>{
                    that.products = res.data;
                    if(that.products.length){
                        that.searchProdCode = that.products[0].prodCode;
                        let defaultSearchValue = {label:that.products[0].prodName,value:that.products[0].prodCode};
                        that.permsSearchCondition.push({label:"产品线",field:"prodCode",default:defaultSearchValue})
                        that.doSearch({})
                    }
                });
            },
            getOrgTypes(){
                let that = this;
                if(!that.orgTypes.length){
                    orgTypeApi.search({}).then(res=>{
                        that.orgTypes = res.data;
                    })
                }
            },
            productSelectChange(val){
                this.terminals = [];
                for(let i of this.products){
                    if(i.prodCode=val){
                        this.terminals = i.terminals;
                    }
                }
            },
            searchProductSelectChange(val){
                this.doSearch({});
            },
            searchMenuTypeSelectChange(val){
                this.doSearch({});
            }
        },
        filters:{
            filterRange(row){
                if(row.useRangeIsAll){
                    return '全部';
                }else {
                    let str = null;
                    for(let u in row.useRanges){
                        if(!str){
                            if(row.useRanges[u].type==2){
                                str = "租户：";
                            }else if(row.useRanges[u].type==3){
                                str = "机构：";
                            }
                        }
                        str += row.useRanges[u].relatedName;
                        if(u < row.useRanges.length-1){
                            str +="，"
                        }
                    }
                    return str;
                }
            },
        }
    }
</script>

<style  lang="scss">
    .el-button--text{
        padding: 0px;
    }
    .el-drawer__body{
        overflow: scroll;
    }

</style>
