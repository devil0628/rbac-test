import Main from 'components/system-frame/components/menus/main.vue';
export default [
    {
        path:'/org-group',
        component:Main,
        meta: {
            breadcrumb: '权限管理',
            hasSubMenu: true,
        },
        name:'org-group',
        redirect: { name: 'org-group-home' },
        children:[
            {
                path:'home',
                meta:{breadcrumb: '首页',},
                component: resolve =>require(['views/system/home'],resolve),
            },
            {
                path:'role',
                meta:{
                    breadcrumb: '角色管理',
                },
                component: resolve =>require(['views/system/default'],resolve),
                children:[
                    {
                        path:'',
                        meta:{
                            breadcrumb: '角色管理',
                        },
                        component:resolve =>require(['views/system/role-default'],resolve)
                    },

                    {
                        path:'detail/:roleId',
                        meta:{
                            breadcrumb: '角色详情',
                        },
                        name:"org-group-role-detail",
                        component:resolve =>require(['views/system/role-detail'],resolve)
                    }
                ]
            },{
                path:'user',
                meta:{breadcrumb: '用户管理',},
                component: resolve =>require(['views/system/user'],resolve),
            },{
                path:'org',
                meta:{breadcrumb: '机构入驻',},
                component: resolve =>require(['views/system/org'],resolve),
            },

        ]
    },
]
