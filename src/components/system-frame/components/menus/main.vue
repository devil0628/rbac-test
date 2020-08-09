<template>
        <el-container class="container">
            <el-aside class="left-aside" >
                <my-menu  :is-collapsed="isCollapsed"></my-menu>
            </el-aside>
            <el-container>
                <el-header class="header-bor">
                    <my-header   :is-collapsed="isCollapsed" @update="changeNavStatus"></my-header>
                </el-header>
                <my-breadcrumb></my-breadcrumb>
                <el-main>
                         <keep-alive  id="wrap" :include="cacheModules">
                             <router-view v-if="isRouterAlive" ></router-view>
                         </keep-alive>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
    //components
    import MyMenu from "./menu";
    import MyHeader from "./header";
    import MyBreadcrumb from "./breadcrumb";
    //vuex
    import { mapState, mapMutations, mapActions } from 'vuex';
    export default {
        name: "my-main",
        components:{
            MyMenu,MyHeader,MyBreadcrumb
        },
        provide () {
            return {
                reload: this.reload
            }
        },
        data(){
            return{
                isCollapsed:false,
                cacheModules:[],
                isRouterAlive:true,
            }
        },
        computed:{
            ...mapState('system',['system','userInfo']),
        },
        created() {
            this.fetchPersonInfo();
        },
        methods:{
            reload () {
                this.isRouterAlive = false
                this.$nextTick(() => this.isRouterAlive = true)
            },
            changeNavStatus(){
                this.isCollapsed = !this.isCollapsed;
            },
            ...mapActions('system', ['fetchPersonInfo']),
        }
    }
</script>

<style  lang="scss" >
   @import "../../../../common/sass/mixin.scss";

    @import "../../../../common/sass/variables.scss";
    @import "../../../../common/sass/style.scss";
    .container{
        height: 100%;

    }
    .left-aside{
        width: auto !important;
        @include scrollBar;
    }
    .header-bor{
        background:rgba(255,255,255,1);
        box-shadow:3px 1px 6px 0px rgba(161,161,161,0.5)
    }

    .el-breadcrumb{
        height: 50px;
        line-height: 50px !important;
        padding: 0 30px;
        @include bgc(#F5F7F9)

    }
    .drawer-head{
        border-bottom: 1px solid $border-color;
        margin-bottom: 30px;
    }


</style>
