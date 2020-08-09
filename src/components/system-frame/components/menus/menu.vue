<template>
        <el-menu class="el-menu-vertical"  :collapse="isCollapsed" :unique-opened="true"
                 background-color="#35414E"
                 text-color="#C2CCD9"
                 :default-active="defaultActive"
        >
            <img  class="all-width"  src="../../../../static/images/logo.png">
            <template v-for="(menu,index) in menus">
                <el-submenu class="top-navbar"   v-if="menu.subMenus"  :key="menu.menuId" :index="index.toString()"  :default-active="defaultActive">
                    <template slot="title">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{menu.menuName}}</span>
                    </template>
                    <el-menu-item  v-for="(sub,subIndex) in menu.subMenus " :key="sub.id" :index="index+'-'+subIndex"  @click="changeRoute(sub)">{{sub.menuName}}</el-menu-item>
                </el-submenu>
                <el-menu-item @click="changeRoute(menu)"
                              v-else
                              :key="menu.menuId"
                              :index="index.toString()"
                              :default-active="defaultActive">{{menu.menuName}}</el-menu-item>

            </template>
        </el-menu>

</template>

<script>
    //store
    import {mapState} from 'vuex'
    //utils
    import {deepCopy} from "../../../../common/js/utils";
    //config
    import config from '../../../../common/js/config'

    export default {
        name: "my-menu",
        props:{
           isCollapsed:{
               type:Boolean,
               default:true
           }
        },
        data(){
            return{
                menus:[],
                defaultActive:''
            }
        },
     /*   created() {
            debugger;
            if(this.$route.path.indexOf('404')!=-1){ //404用于逻辑判断，暂时不用于url的跳转
                this.$router.push({
                    path: window.sessionStorage.getItem("navDefaultPath")
                });
            }
        },*/
        mounted() {
            this.menus = deepCopy(this.menuList);
            //侧边栏当前高亮
            for(let j=0;j<this.menus.length;j++){
                if(this.$route.path == this.menus[j].address){
                    this.defaultActive = j.toString();
                }
                for(let k = 0;k<this.menus[j].subMenus.length;k++){
                    if(this.$route.path.indexOf(this.menus[j].subMenus[k].address)!=-1){
                        this.defaultActive = j+'-'+k
                        break;
                    }
                }
            }
        },
        computed:{
            ...mapState('system',['menuList','userInfo']),
        },
        methods:{
            changeRoute(menu){
                if(menu.addressType.toLowerCase()=="vue"){
                    this.$router.push({path:menu.address})
                }else if(menu.addressType.toLowerCase()=="HTTP"){
                    if(menu.address.indexOf("?")){
                        window.location.href=menu.address+"&access_token="+window.sessionStorage.getItem("access_token")
                    }else{
                        window.location.href=menu.address+"?access_token="+window.sessionStorage.getItem("access_token")
                    }
                }else if(menu.addressType=="IFRAME"){

                }
            }
        }
    }
</script>

<style  lang="scss">
    @import "../../../../common/sass/mixin.scss";
    @import "../../../../common/sass/style.scss";

    .el-submenu.is-opened>.el-submenu__title {
        color: #ffffff !important;
    }
    .el-submenu.is-opened>ul>li{
        color: #ffffff !important;
        background-color: #2E3742 !important;
    }
    .el-submenu.is-opened>ul>li.is-active {
        background-color: #1ECC8B !important;

    }
    .el-menu-vertical{
        height: 100%;
        @include scrollBar;
    }
    .all-width{
        width: 100%;
    }
    .el-submenu .el-menu-item{
        min-width: 100%;
    }


</style>
