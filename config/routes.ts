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
        name: 'disease master',
        path: '/complaints/addDisease',
        component: './Complaint/components/AddDisease',
      },
    ],
  },
  {
    name: 'Institute',
    path: '/institute',
    routes: [
      {
        name: 'Institute',
        path: '/institute/list',
        component: './Institute',
      },
      {
        name: 'edit-institute',
        path: '/institute/edit',
        component: './Candidate/components/EditCandidate',
      },
      {
        name: 'Institute Search',
        path: '/institute/list',
        component: './Institute/components/applications/index',
      },
      {
        name: 'institute-details',
        path: '/institute/institute-details/:id',
        component: './Booking/components/InstituteDetails',
      },
    ],
  },
  {
    path: '/instituteUser',
    layout: false,
    routes: [
      {
        name: 'add-instituteuser',
        path: '/instituteUser/candidate/add',
        component: './InstituteUser/components/Registration',
      },

    ],
  },
  {
    name: 'Institute Candidate',
    path:"/instituteCandidate",
    routes: [
      {
        name: 'Institute Candidate',
        path: '/instituteCandidate/list',
        component: './InstituteUser',
      },
      {
        name: 'Report',
        path: '/instituteCandidate/report',
        component: './Report/Report'
      },
      {
        name: 'add-instituteCandidate',
        path: '/instituteCandidate/candidate/add',
        component: './InstituteUser/components/Registration',
      },

    ],
  },
  {
    name: 'booking',
    path: '/booking',
    routes: [
      {
        name: 'booking',
        path: '/booking/list',
        component: './Booking',
      },
      {
        name: 'Institute Search',
        path: '/booking/institute-list',
        component: './Institute/components/applications/index',
      },
      {
        name: 'institute-details',
        path: '/booking/institute-details/:id',
        component: './Booking/components/InstituteDetails',
      },
      {
        name: 'room-booking',
        path: '/booking/room-booking',
        component: './Booking/components/RoomBooking',
      },
      {
        name: 'booking-orders',
        path: '/booking/booking-order',
        component: './Booking/components/BookingOrder',
      },
      {
        name: 'booking-orders-details',
        path: '/booking/booking-order-details/:id',
        component: './Booking/components/BookingOrderDetails',
      },
      {
        name: 'Booking Report',
        path: '/booking/BookingReport',
        component: './Booking/components/BookingReport',
      }

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
