<template>
    <div class="header-wrap">
        <div class="header-title">
            <i class="el-icon-s-unfold" @click="updateCollapse"></i>
            <span>{{userInfo.roles?userInfo.roles[0].orgName:""}}</span>
        </div>
        <div class="header-menu">
            <el-button v-if="orgPage" class="header-menu_back" type="text" @click="backToManage" size="mini" plain icon="el-icon-arrow-left">返回管理页面</el-button>
            <div class="header-menu_msg">
                <i class="el-icon-message-solid"></i>
                <span>消息</span>
            </div>
            <div class="header-menu_link" v-if="userInfo.roles && userInfo.roles.length>1">
                <el-dropdown @command="handleRoleChangeCommand">
                    <div class="el-dropdown-link">
                        <span>{{userInfo.currentRoleMultiName}}  <i class="el-icon-arrow-down el-icon--right"></i></span>
                    </div>
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item v-for="(role,index) in userInfo.roles"
                                          :key="index"
                                          :command="role.roleId">{{role.roleMultiName}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="header-menu_link">
                <el-dropdown @command="handleCommand">
                  <div class="el-dropdown-link">
                      <img src="../../../../static/images/personal.png">
                    <span>{{userInfo.username}}  <i class="el-icon-arrow-down el-icon--right"></i></span>
                  </div>
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item command="info">个人信息</el-dropdown-item>
                        <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

        </div>
        <el-dialog title="个人信息" :visible.sync="userInfoDialogVisible" width="30%" >
             <el-form label-width="100px">
                 <el-form-item label="姓名">{{userInfo.username}}</el-form-item>
                 <el-form-item label="手机号"> {{userInfo.phone}}</el-form-item>
                 <el-form-item label="登录账号"> {{userInfo.loginAccount}}</el-form-item>
             </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="userInfoDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="userPwdDialogVisible" width="30%" >
            <el-form :model="user" label-width="100px" ref="userForm" :rules="rules">
                <el-form-item label="原密码" prop="oldPwd">
                    <el-input v-model="user.oldPwd" placeholder="请输入原密码" ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="user.newPwd" placeholder="请输入新密码" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userPwdDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changePwd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {changePwd,changeRole} from '../../../../api/user'

    export default {
        name: "my-header",
        props:{
            isCollapsed:{
                type:Boolean,
                default:true
            },

        },
        data(){
            return{
                userInfoDialogVisible:false,
                userPwdDialogVisible:false,
                orgPage:window.sessionStorage.getItem("menuType")=='USER'&&userinfo.roles[0].roleType!='USER',
                user:{
                    oldPwd:"",
                    newPwd:"",
                },
                rules: {
                    oldPwd: [ {required: true, message: '请输入原密码', trigger: 'blur'},],
                    newPwd: [ {required: true, message: '请输入新密码', trigger: 'blur'},],
                },
            }
        },
        mounted() {

        },
        computed:{
            ...mapState('system',['userInfo']),
        },
        methods:{
            updateCollapse(){
                this.$emit('update');
            },
            handleCommand(command){
                if(command=='logout'){
                    window.sessionStorage.clear();
                    location.href="../login/v2/logout?access_token="+window.sessionStorage.getItem("access_token")
                }else if(command=='info'){
                    this.userInfoDialogVisible = true;
                }else if(command=='pwd'){
                    this.userPwdDialogVisible=true;
                }
            },
            handleRoleChangeCommand(command){
                changeRole(command).then(res=>{
                    if(res.status==200){
                        window.location.reload();
                    }
                });
            },
            changePwd(){
                let that = this;
                that.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        changePwd(that.user).then(res=>{
                            if(res.data.msg){
                                that.$message.warning(res.data.msg);
                            }else{
                                that.$message.success('修改成功');
                                that.userPwdDialogVisible = false;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            backToManage(){

            },
        }
    }
</script>

<style scoped lang="scss">
    .header-wrap{
        width: 100%;
        height: 56px;
        line-height: 54px;
        display: flex;
        justify-content: space-between;

    }
    .header{
        &-title{
            span{
                display: inline-block;
                margin-left: 20px;
            }

        }
        &-menu{
            display: flex;
            img{
                width: 30px;
                position: absolute;
                left: -42px;
                top: 10px;
            }
            &_msg{
                display: inline-block;
                margin-right: 30px;
                cursor: pointer;
                span{
                    display: inline-block;
                    margin-left: 20px;
                }
            }
            &_link{
                cursor: pointer;
                margin-left: 40px;
                padding-right: 20px;

            }
            &_back{
                cursor: pointer;
                margin-left: 40px;
                padding-right: 20px;
            }
        }
    }

</style>
