<template>
    <div>
        <iframe :src="iframeUrl"  :style="{'width': '100%','height': iframeHeight+'px'}" ></iframe>
    </div>

</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "other",
        data(){
            return{
                iframeHeight:200

            }
        },
        methods:{
        },
        computed:{
            ...mapState('system',['iframeUrl']),
        },
        mounted() {
            let oDiv =document.getElementsByClassName('el-main')
            this.iframeHeight = oDiv[0].clientHeight-50;
        }
    }
</script>

<style scoped>

</style>
