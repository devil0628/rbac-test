import Main from 'components/system-frame/components/menus/main.vue';

export default [
    {
        path:'/platform',
        component:Main,
        meta: {
            breadcrumb: '权限管理',
            hasSubMenu: true,
        },
        name:'platform',
        redirect: { name: 'platform-home' },
        children:[
            {
                path:'home',
                meta:{breadcrumb: '首页',},
                component: resolve =>require(['views/platform/home'],resolve),
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
                        name:"platform-role-detail",
                        component:resolve =>require(['views/system/role-detail'],resolve)
                    }
                ]
            },{
                path:'user',
                meta:{breadcrumb: '用户管理',},
                component: resolve =>require(['views/system/user'],resolve),
            },{
                path:'tenant',
                meta:{breadcrumb: '企业入驻',},
                component: resolve =>require(['views/system/default'],resolve),
                children:[
                    {
                        path:'',
                        meta:{
                            breadcrumb: '企业入驻',
                        },
                        component:resolve =>require(['views/system/tenant'],resolve)
                    },

                    {
                        path:':tenantId/:tenantName/org',
                        meta:{
                            breadcrumb: '下属机构',
                        },
                        name:"platform-tenant-org",
                        component:resolve =>require(['views/system/org'],resolve)
                    }
                ]
            },{
                path:'org',
                meta:{breadcrumb: '机构入驻',},
                component: resolve =>require(['views/system/org'],resolve),
            },

        ]
    },
]
