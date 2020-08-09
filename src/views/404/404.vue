<!-- 404 页面 -->
<template>
    <div class="not-found-module">
        <div class="icon-wrap">
            <div class="icon"></div>
            <p class="desc">{{tips}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            timeMachine: { // 是否需要提供返回首页按钮
                type: Boolean,
                default: true
            },
            tips: {
                type: [ String, Number ],
                default: '页面走丢了'
            },
        },
        data () {
            return {}
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    @import "~common/sass/variables";
    @import "~common/sass/mixin";

    /* variables */

    .not-found-module {
        @include full;
        overflow: hidden;
        position: relative;
        .icon-wrap {
            @include trans-center;
        }
        .icon {
            @include bg;
            width: 300px;
            height: 200px;
            background-image: url(../../static/images/404.png);
        }
        .desc {
            @include line-height(30px);
            margin-top: 20px;
            text-align: center;
            letter-spacing: 2px;
            font-size: 26px;
            color: #bbbbbb;
        }
        .btn {
            display: block;
            margin: 20px auto;
        }
    }

</style>
