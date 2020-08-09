import Main from 'components/system-frame/components/menus/main.vue';

export default [
    {
        path: '/other',
        component: Main,
        meta: {
            module: 'other',
            breadcrumb: 'other'
        },
        children: [
            {
                path: '',
                name: 'other',
                meta: {
                    module: 'other',
                    breadcrumb: ''
                },
                component: resolve => require(['views/iframe/other'], resolve),
            },
        ]
    },
    {
        path: '*',
        redirect: { name:'other' }
    }
];
