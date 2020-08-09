# 系统外框组件，包含了菜单栏，顶部固定header栏，操作栏，系统消息等

##*index.vue 主入口
##*compontents 包含了各子组件
    *header-header顶部栏
    *websocket-系统websocket通信
    *menus-菜单栏以及权限相关
    *system-包含了会在全局弹出或其他方式使用到的全局组件：修改密码/切换中英文/退出/消息历史等

组件

*用法说明
1.需要在编译模板index.html中引入万店掌iconfont图标库地址（所有小图标都基于此库）
2.考虑到外部主项目中用到了部分常用开源组件这里也就没有打包进去，可以查看package.json中peerDependencies

*组件提供的额外功能
1.状态管理：组件中包含了模块名为system的全局状态，可以提供外部主项目直接使用,这样也要求外部状态管理也需要国际化
2.提供路由跳转方法:外部主项目中所有Vue实例中都可以直接使用this.$system.goRouter
3.所有权限操作相关的方法将会注册在$system.$auth上面:this.$system.$auth.isSuper this.$system.$auth.isRoot等，且不能随意修改各方法实现
4.全局事件总线，定义在$eventbus上面，在外部主项目中可以直接通过this.$eventbus来使用
5.在外部主项目中想要访问系统级的状态，变量可以通过this.$system.$state来访问，后续如果需要修改的话可以考虑提供修改方法，尽量不在外部项目中直接使用和修改系统组件中的状态
6.内部已经集成了国际化解决方案
7.内部已经集成了websocket1.0解决方案

#集成方法
1.getLanguage