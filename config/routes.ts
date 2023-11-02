/**
 * @name umi routing configuration for
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon Configuration
 * @param path  path only supports two placeholder configurations, the first is the form of the dynamic parameter :id, the second is the * wildcard, and the wildcard can only appear at the end of the routing string.
 * @param component Configure the path of the React component to be rendered after matching location and path. It can be an absolute path or a relative path. If it is a relative path, it will start from src/pages.
 * @param routes Configure sub-routes, usually used when you need to add layout components for multiple paths.
 * @param redirect Configure routing jump
 * @param wrappers Configure the packaging component of the routing component. Through the packaging component, more functions can be combined into the current routing component. For example, it can be used for permission verification at the routing level
 * @param name Configure the title of the route. By default, the value of menu.xxxx in the internationalization file menu.ts is read. If the name is configured as login, the value of menu.login in menu.ts is read as the title
 * @param icon Configure the icon of the route, refer to https://ant.design/components/icon-cn for the value, pay attention to remove the style suffix and capitalization, if you want to configure the icon as <StepBackwardOutlined />, the value should be stepBackward or StepBackward, such as If you want to configure the icon as <UserOutlined />, the value should be user or User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        name: 'candidate-activation',
        path: '/user/candidateActivation',
        component: './User/CandidateActivation',
      },
      {
        name: 'package',
        path: '/user/package',
        component: './User/Package',
      },
      {
        name: 'add-candidate',
        path: '/user/candidate/add',
        component: './Candidate/components/Registration',
      },
      {
        name: 'instituteuser-activation',
        path: '/user/institututeUserActivation',
        component: './User/InstitututeUserActivation',
      },
    ],
  },
  {
    name: 'Update',
    path: '/update',
    routes: [
      {
        name: 'user profile',
        path: '/update/user-profile',
        component: './User/UserProfile/UserProfile',
      }
    ]
  },
  {
    path: '/welcome',
    name: 'Welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    name: 'Candidate',
    path: '/candidate',
    routes: [
      {
        name: 'Candidate Profile',
        path: '/candidate/list',
        component: './Candidate',
      }
    ],
  },
  {
    name: 'complaints',
    path: '/complaints',
    routes: [
      {
        name: 'complaint master',
        path: '/complaints/addComplaint',
        component: './Complaint/components/AddComplaint',
      },
      {
        name: 'complaint list',
        path: '/complaints/list',
        component: './Complaint/components/ComplaintList',
      },
      {
        name: 'disease master',
        path: '/complaints/addDisease',
        component: './Complaint/components/AddDisease',
      },
      {
        name: 'InvGroup master',
        path: '/complaints/addInvGroup',
        component: './Complaint/components/AddInvGroup',
      },
      {
        name: 'InvUnit master',
        path: '/complaints/addInvUnit',
        component: './Complaint/components/AddInvUnit',
      },
      {
        name: 'AddInvUnit', 
        path: '/complaints/AddInvUnit',
        component: './Complaint/components/AddInvUnit',
      },
      {
        name: 'DiseaseList', 
        path: '/complaints/DiseaseList',
        component: './Complaint/components/DiseaseList',
      },
      {
        name: 'AddOnlineLogin',
        path: '/complaints/AddOnlineLogin',
        component: './Online/components/AddOnlineLogin',
      },
      {
        name: 'AddPatRequest', 
        path: '/complaints/AddPatRequest',
        component: './Online/components/AddPatRequest',
      },
    ],
  },
  {
    name: 'investigation',
    path: '/investigation',
    routes: [
      {
        name: 'Investigation',
        path: '/investigation/AddInvParameter',
        component: './Investigation/components/AddInvParameter',
      },
      {
        name: 'InvGroup master',
        path: '/investigation/addInvGroup',
        component: './Investigation/components/AddInvGroup',
      },
      {
        name: 'InvGroup master',
        path: '/investigation/list',
        component: './Investigation/components/InvestigationList',
      },
      {
        name: 'InvGroup master',
        path: '/investigation/group-list',
        component: './Investigation/components/InvestigationGroupList',
      },
    ],
  },
  {
    name: 'User Management2',
    path: '/user-management',
    routes: [
      {
        name: 'User Management1',
        path: '/user-management/list',
        component: './UserManagement',
      },
      {
        name: 'User Management3',
        path: 'list',
        component: './UserManagement',
      },
      {
        name: 'UserRolePermission',
        path: '/user-management/userrole',
        component: './UserRolePermission',
      },
    ],
  },
  {
    name: 'Role Form Permission',
    routes: [
      {
        name: 'UserRolePermission',
        path: '/userrole',
        component: './UserRolePermission',
      }
    ],
  },
  {
    name: 'Change Password',
    routes: [
      {
        name: 'ChangePassw',
        path: '/UserManagement/change-password',
        component: './UserManagement/components/UserChangePass',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  }, {
    path: '/candidate-dashboard',
    component: './CandidateDashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
