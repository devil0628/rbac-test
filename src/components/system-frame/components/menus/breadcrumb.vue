<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(nav,index) in navList" :to="nav.url" :key="index">{{nav.name}}</el-breadcrumb-item>
    </el-breadcrumb>

</template>

<script>
    export default {
        name: "breadcrumb",
        data(){
            return{
                navList:[]

            }
        },
        created() {
            this.setBreadcrumb(this.$route);
        },
        mounted() {
            this.$router.afterEach((to, from) => {
                this.setBreadcrumb(to);
            });
        },
        methods:{
            setBreadcrumb(path) {
                let breadcrumbList = path.matched.filter(val => !!val.meta.breadcrumb);
                this.navList = breadcrumbList.map(val => ({
                    name: val.meta.breadcrumb,
                    url: this.handleParamsPath(val.path)
                }));
            },
            handleParamsPath(url) {
                const arr = url.split('/');
                arr.forEach((item,index,array) => {
                    // 当有':'时替换为params中相应属性的值
                    if (item.indexOf(':') != -1) {
                        array[index] = this.$route.params[item.split(':')[1]]
                    }
                })
                const res = arr.join('/');
                return res
            }

        }
    }
</script>

<style scoped>

</style>
