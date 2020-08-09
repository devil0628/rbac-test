import Main from 'components/system-frame/components/menus/main.vue';

export default [
    {
        path:'/system',
        component:Main,
        meta: {
            breadcrumb: '权限管理',
            hasSubMenu: true,
        },
        name:'system',
        redirect: { name: 'system-home' },
        children:[
            {
                path:'home',
                meta:{breadcrumb: '首页',},
                component: resolve =>require(['views/system/home'],resolve),
            }, {
                path:'menu',
                meta:{
                    breadcrumb: '菜单管理',
                },
                component: resolve =>require(['views/system/default'],resolve),
                children:[
                    {
                        path:'',
                        meta:{
                            breadcrumb: '',
                        },
                        component:resolve =>require(['views/system/menu-default'],resolve)
                    },
                ]
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
                        name:"system-role-detail",
                        component:resolve =>require(['views/system/role-detail'],resolve)
                    }
                ]
            }, {
                path:'permission',
                meta:{breadcrumb: '功能权限',},
                component: resolve =>require(['views/system/permission'],resolve),
            }, {
                path:'user',
                meta:{breadcrumb: '用户管理',},
                component: resolve =>require(['views/system/user'],resolve),
            },{
                path:'org-type',
                meta:{breadcrumb: '机构类型',},
                component: resolve =>require(['views/system/org-type'],resolve),
            },{
                path:'product',
                meta:{breadcrumb: '产品线',},
                component: resolve =>require(['views/system/product'],resolve),
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
                        name:"system-tenant-org",
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
