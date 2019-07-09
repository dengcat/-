import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/sso',
    component: () => import('@/views/login/SSO'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: {
        title: '首页',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
  {
      path: 'jybb',
      component: () => import('@/views/dashboard/index'),
      name: '经营数据分析',
      alwaysShow: true, // will always show the root menu
      meta: {
        title: '经营数据分析',
        icon: 'jybb',
        noCache: true
      },
      children: [{
          path: 'jt',
          component: () => import('@/views/dashboard/index'),
          name: '集团维度',
          meta: {
            title: '集团维度',
            noCache: true
          }
        },
        {
          path: 'qy',
          component: () => import('@/views/dashboard/index'),
          name: '区域维度',
          meta: {
            title: '区域维度',
            noCache: true
          }
        }, {
          path: 'xm',
          component: () => import('@/views/dashboard/index'),
          name: '项目维度',
          meta: {
            title: '项目维度',
            noCache: true
          }
        }
      ]
  },
  {
    path: '/outline',
    component: Layout,
    redirect: '/outline/outlinelist',
    name: 'Outline',
    alwaysShow: true,
    meta: {
      title: '项目数据维护',
      icon: 'xmsj',
      noCache: true,
      noKey: true,
    },
    children: [
      {
        path: '/outline/addoutline',
        component: () => import('@/views/outline/outlinemanager/index'),
        name: 'Outline',
        alwaysShow: true,
        meta: {
          title: '新增实施纲要',
          noCache: true,
          noKey: true,
          // icon: 'mbgl',
        }
      },
      {
        path: '/outline/outlinelist',
        component: () => import('@/views/outline/outlinemanager/outlinelist'),
        name: 'OutlineList',
        alwaysShow: true,
        meta: {
          title: '维护实施纲要',
          noCache: true,
          noKey: true,
          // icon: 'mbgl',
        }
      },
      // {
      //   path: '/outline/VersionManage',
      //   component: () => import('@/views/Outline/OutlineManager/components/VersionManage'),
      //   name: 'VersionManage',
      //   alwaysShow: true,
      //   meta: {
      //     title: '版本管理列表',
      //     // icon: 'mbgl',
      //   }
      // },
      {
        path: '/outline/mpiparamvalue',
        component: () => import('@/views/outline/paramsetting/mpiparamvalue'),
        name: 'MpiParamValue',
        alwaysShow: true,
        meta: {
          title: '参数设置',
          noCache: true,
          noKey: true,
          // roles: ['1007']
        }
      },
      {
        path: '/outline/projectselect',
        component: () => import('@/views/outline/outlinemanager/projectselect'),
        name: 'ProjectSelect',
        hidden: true,
        meta: {
          title: '新增版本模板',
          noCache: true,
          noKey: true,
          // roles: ['1007']
        }
      },
      {
        path: '/outline/test',
        component: () => import('@/views/outline/outlinemanager/test'),
        name: 'test',
        hidden: true,
        meta: {
          title: '新增版本模板',
          noCache: true,
          // roles: ['1007']
        }
      },
      {
        path: '/outline/:projectId/:projectName/:templateGUID/:parentId/:type/:id?',
        component: () => import('@/views/outline/outlinemanager/components/GoodsValueLd'),
        name: 'test',
        hidden: true,
        meta: {
          title: '数据维护',
          noCache: true,
        }
      },
      {
        path: '/outline/outlineinfo/:id',
        component: () => import('@/views/outline/outlinemanager/outlineinfo'),
        name: 'OutlineInfo',
        hidden: true,
        meta: {
          title: '实施纲要详情',
          noKey: true,
          noCache: true,
          // roles: ['1007']
        },
        children: [
          {
            path: ':step',
            component: () => import('@/views/outline/outlinemanager/outlinestep'),
            name: 'OutlineStep',
            hidden: true,
            meta: {
              title: '新增版本模板',
              noCache: true,
              noKey: true,
              // roles: ['1007']
            }
          },
        ]
      },
      // {
      //   path: '/outline/modifyoutline/',
      //   component: () => import('@/views/Outline/OutlineManager/modifyoutline'),
      //   name: 'ModifyOutline',
      //   hidden: true,
      //   meta: {
      //     title: '维护实施纲要',
      //     // icon: 'mbgl',
      //   }
      // }
    ]
  },
]

export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

// 异步的路由，权限控制
export const asyncRouterMap =
[
  {
    path: '/mdmprojectinfo/:businessDataGUID/:serialNo?',
    component: () => import('@/views/mdmmanager/mdmprojectinfo'),
    name: 'MdmProjectInfo',
    hidden: true,
    meta: {
      title: '项目信息',
      noCache: true,
      // roles: ['1013']
    },
  },
  {
  path: '/',
  component: Layout,
  redirect: '/mdmdefine/index',
  name: 'Mdm',
  meta: {
    title: '主数据维护',
    icon: 'mdm',
    roles: ['1004'],
    noCache: true
  },
  children: [
    {
      path: 'mdmdefine',
      component: () => import('@/views/mdmdefine/index'),
      name: 'MdmDefine',
      redirect: '/mdmdefine/index',
      alwaysShow: true, // will always show the root menu
      meta: {
        title: '指标定义',
        icon: 'zb',
        roles: ['1008'],
        noCache: true
      },
      children: [
        {
          path: 'index',
          component: () => import('@/views/mdmdefine/templates/index'),
          name: 'MdmTemplates',
          meta: {
            title: '指标模板',
            roles: ['1012'],
            noCache: true
            // icon: 'mbgl',
          }
        },
        {
          path: 'addtemplates',
          component: () => import('@/views/mdmdefine/templates/addtemplates'),
          name: 'AddTemplates',
          hidden: true,
          meta: {
            title: '新增指标模板',
            noCache: true,
            roles: ['1012']
          }
        },
        {
          path: 'edittemplates/:id',
          component: () => import('@/views/mdmdefine/templates/edittemplates'),
          name: 'EditTemplates',
          hidden: true,
          meta: {
            title: '修改数据模板',
            noCache: true,
            roles: ['1012']
          }
        },
      ]
    },
    {
      path: 'mdmmanager',
      component: () => import('@/views/mdmmanager/index'),
      redirect: '/mdmmanager/index',
      name: 'MdmManager',
      alwaysShow: true, // will always show the root menu
      meta: {
        title: '指标维护',
        icon: 'bj',
        roles: ['1009'],
        noCache: true,
      },
      children: [{
          path: 'index',
          component: () => import('@/views/mdmmanager/mdmprojectlist'),
          name: 'MdmProjectList',
          meta: {
            title: '项目指标维护',
            roles: ['1013'],
            noCache: true,
            // icon: 'xm',
          }
        },
        {
          path: 'addmdmproject',
          component: () => import('@/views/mdmmanager/addmdmproject'),
          name: 'AddMdmProject',
          hidden: true,
          meta: {
            title: '新增项目',
            roles: ['1013'],
            noCache: true
          }
        },
        {
          path: 'mdmmanagerdetail/:id',
          component: () => import('@/views/mdmmanager/mdmmanagerdetail'),
          name: 'MdmManagerDetail',
          hidden: true,
          meta: {
            title: '编辑数据模板',
            roles: ['1013'],
            noCache: true,
          }
        },
        {
          path: 'mdmmanager/:type',
          component: () => import('@/views/mdmmanager/mdmmanager'),
          name: 'MdmManagerList',
          hidden: true,
          meta: {
            title: '数据维护',
            roles: ['1013'],
            noCache: true,
          }
        },
        {
          path: 'mdmmanagerinfo/:id',
          component: () => import('@/views/mdmmanager/mdmmanagerinfo'),
          name: 'MdmManagerInfo',
          hidden: true,
          meta: {
            title: '新增数据模板',
            roles: ['1013'],
            noCache: true,
          }
        },
        {
          path: 'mdmprojectobject/:projectId/:projectName/:templateGUID/:parentId/:type/:id?',
          component: () => import('@/views/mdmmanager/mdmprojectobject'),
          name: 'MdmProjectObject',
          hidden: true,
          meta: {
            title: '数据维护',
            noCache: true,
            roles: ['1013']
          }
        },
        {
          path: 'mdmprojectedit/:id/:templateGUID',
          component: () => import('@/views/mdmmanager/mdmprojectedit'),
          name: 'MdmProjectEdit',
          hidden: true,
          meta: {
            title: '维护项目信息',
            noCache: true,
            roles: ['1013']
          },
        },
        {
          path: 'version',
          component: () => import('@/views/mdmmanager/version'),
          name: 'Version',
          meta: {
            title: '版本查询',
            roles: ['1014'],
            noCache: true,
            // icon: 'bb',
          }
        },
        {
          path: 'versioncom/:businessDataGuid/:versionlist',
          component: () => import('@/views/mdmmanager/versioncom'),
          name: 'VersionCom',
          hidden: true,
          meta: {
            title: '版本对比',
            noCache: true,
            roles: ['1014']
          }
        },
        {
          path: 'distributeLog/:id',
          component: () => import('@/views/mdmmanager/distributeLog'),
          name: 'DistributeLog',
          hidden: true,
          meta: {
            title: '分发日志',
            noCache: true,
            roles: ['1013']
          },
        }

        // {
        //   path: 'edittemplates/:id',
        //   component: () => import('@/views/mdmdefine/templates/edittemplates'),
        //   name: 'EditTemplates',
        //   hidden: true,
        //   meta: {
        //     title: '新增数据模板',
        //   }
        // },
      ]
    },
    {
      path: 'supplier',
      component: () => import('@/views/report/redirect'),
      redirect: '/supplier/index',
      name: 'Supplier',
      alwaysShow: true, // will always show the root menu
      meta: {
        title: '供应商管理',
        icon: 'baobiao',
        roles: ['1023'],
        noCache: true,
      },
      children: [{
          path: 'index',
          component: () => import('@/views/supplier/index'),
          name: 'SupplierList',
          meta: {
            title: '供应商列表',
            roles: ['1024'],
            noCache: true,
            // icon: 'baobiao',
          }
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/supplier/detail'),
          name: 'SupplierDetail',
          hidden: true,
          meta: {
            title: '供应商详细信息',
            icon: 'clipboard',
            roles: ['1024'],
            noCache: true,
          }
        },
      ]
    },
    {
      path: 'report',
      component: () => import('@/views/report/redirect'),
      redirect: '/report/index',
      name: 'Report',
      alwaysShow: true, // will always show the root menu
      meta: {
        title: '报表',
        icon: 'baobiao',
        roles: ['1010'],
        noCache: true,
      },
      children: [{
          path: 'index',
          component: () => import('@/views/report/index'),
          name: 'ReportList',
          meta: {
            title: '报表',
            roles: ['1015'],
            noCache: true,
            // icon: 'baobiao',
          }
        },
        {
          path: 'detail/:url',
          component: () => import('@/views/report/detail'),
          name: 'ReportDetail',
          hidden: true,
          meta: {
            title: '经营数据填报报表',
            icon: 'clipboard',
            roles: ['1015'],
            noCache: true,
          }
        },
      ]
    },
    {
      path: 'setting',
      component: () => import('@/views/setting/redirect'),
      redirect: '/setting/index',
      name: 'Setting',
      alwaysShow: true, // will always show the root menu
      meta: {
        title: '系统设置',
        icon: 'setting',
        noCache: true,
        roles: ['1011']
      },
      children: [{
          path: 'index',
          component: () => import('@/views/setting/index'),
          name: 'MdmTemplates',
          meta: {
            title: '参数设置',
            roles: ['1016'],
            noCache: true,
            // icon: 'setting',
          }
        },
        {
          path: 'role',
          component: () => import('@/views/setting/role'),
          name: 'Role',
          meta: {
            title: '角色关系维护',
            roles: ['1017'],
            noCache: true,
            // icon: 'setting',
          }
        },
        {
          path: 'rolerelation',
          component: () => import('@/views/setting/rolerelation'),
          name: 'RoleRelation',
          hidden: true,
          meta: {
            title: '角色关系维护',
            roles: ['1017'],
            noCache: true,

            // icon: 'setting',
          }
        },
        {
          path: 'addsystem',
          component: () => import('@/views/setting/addsystem'),
          name: 'AddSystem',
          hidden: true,
          meta: {
            title: '子系统维护',
            icon: 'setting',
            roles: ['1017'],
            noCache: true,
          }
        },
        {
          path: 'mdmrole',
          component: () => import('@/views/setting/mdmrole'),
          name: 'MdmRole',
          meta: {
            title: '主数据角色',
            noCache: true,
            roles: ['1018']
            // icon: 'setting',
          }
        },
        {
          path: 'userinfo',
          component: () => import('@/views/setting/userinfo'),
          name: 'UserInfo',
          meta: {
            title: '用户管理',
            roles: ['1019'],
            noCache: true,
            // icon: 'setting',
          }
        },
        {
          path: 'mailsetting',
          component: () => import('@/views/setting/mailsetting'),
          name: 'MailSetting',
          meta: {
            title: '邮件通知设置',
            roles: ['1020'],
            noCache: true,
            // icon: 'setting',
          }
        },
        {
          path: 'reportsetting',
          component: () => import('@/views/setting/reportsetting'),
          name: 'ReportSetting',
          meta: {
            title: '报表设置',
            roles: ['1021'],
            noCache: true,
            // icon: 'setting',
          }
        }
      ]
    },
    {
      path: `${process.env.SIP_API}`,
      component: Layout,
      meta: {
        title: '接口集成平台',
        icon: 'API',
        // roles: ['1022'],
        token: true
      },
    },
  ]
},
{
  path: '*',
  redirect: '/401',
  hidden: true
}]

