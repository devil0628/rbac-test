import Main from 'components/system-frame/components/menus/main.vue';

export default [
    {
        path: '/404',
        component: Main,
        meta: {
            module: '404',
            breadcrumb: '404'
        },
        children: [
            {
                path: '',
                name: '404',
                meta: {
                    module: '404',
                    breadcrumb: ''
                },
                component: resolve => require(['views/404/404'], resolve),
            },
        ]
    },
    {
        path: '*',
        redirect: { path:window.sessionStorage.getItem("navDefaultPath") }
    }
];
