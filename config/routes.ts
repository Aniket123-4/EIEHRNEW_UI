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
        component: './Online/components/AddOnlineLogin',
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
    name: 'master',
    path: '/master',
    routes: [
      {
        name: 'complaint master',
        path: '/master/addComplaint',
        component: './Complaint/components/AddComplaint',
      },
      {
        name: 'complaint list',
        path: '/master/list',
        component: './Complaint/components/ComplaintList',
      },
      {
        name: 'disease master',
        path: '/master/addDisease',
        component: './Complaint/components/AddDisease',
      },
      {
        name: 'InvGroup master',
        path: '/master/addInvGroup',
        component: './Complaint/components/AddInvGroup',
      },
      {
        name: 'InvUnit master',
        path: '/master/addInvUnit',
        component: './Complaint/components/AddInvUnit',
      },
      {
        name: 'AddInvUnit',
        path: '/master/AddInvUnit',
        component: './Complaint/components/AddInvUnit',
      },
      {
        name: 'DiseaseList',
        path: '/master/DiseaseList',
        component: './Complaint/components/DiseaseList',
      },
      {
        name: 'Search Patient',
        path: '/master/Patient',
        component: './Online',
      },
      {
        name: 'Manage Appointment',
        path: '/master/ManageAppointment',
        component: './Online/components/SearchAppointment',
      },
      {
        name: 'Investigation Services',
        path: '/master/AddInvServices',
        component: './Complaint/components/AddInvService',
      },
    ],
  },
  {
    name: 'patient',
    path: '/patient',
    routes: [
      {
        name: 'Patient Registration',
        path: '/patient/PatientRegistration',
        component: './Patient/components/PatientRegistration',
      },
      {
        name: 'Edit Patient',
        path: '/patient/EditPatient/:id',
        component: './Patient/components/EditPatient',
      },
      {
        name: 'View Patient',
        path: '/patient/ViewPatient/:id',
        component: './Patient/components/ViewPatient',
      },
      {
        name: 'Patient File',
        path: '/patient/PatientFile',
        component: './Patient/components/PatientFile',
      },
      {
        name: 'New Token No',
        path: '/patient/NewTokenNo',
        component: './Patient/components/NewTokenNo',
      },
      {
        name: 'Patient CheckOut',
        path: '/patient/PatientCheckOut',
        component: './Patient/components/PatientCheckout',
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
    name: 'booking',
    path: '/booking',
    routes: [
      {
        name: 'Investigation',
        path: '/booking/doctor-slot-booking',
        component: './Booking/components/AddDoctorSlotBooking',
      },
      {
        name: 'Appoint Details List',
        path: '/booking/doctor-slot-booking-details/:id/:id/:id/:id/:id',
        component: './Booking/components/DoctorSlotAppointListDetails',
      },
      {
        name: 'Appointment Booking',
        path: '/booking/appointment-booking',
        component: './Booking/components/AppointmentBooking',
      }
    ],
  },
  {
    name: 'patient',
    path: '/patient',
    routes: [
      {
        name: 'Patient',
        path: '/patient/search',
        component: './Patient/components/PatientList',
      },

    ],
  },

  {
    name: 'doctor',
    path: '/doctor',
    routes: [
      {
        name: 'Doctor',
        path: '/doctor/patient-list',
        component: './DoctorForm/components/DoctorPatientList',
      },
      {
        name: 'Patient Details',
        path: '/doctor/patient-details/:id',
        component: './DoctorForm/components/DoctorPatientDetails',
      },

    ],
  },
  {
    name: 'reception',
    path: '/reception',
    routes: [
      {
        name: 'Reception',
        path: '/reception/search',
        component: './Reception/components/ReceptionSearch',
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
  },
  {
    path: '/candidate-dashboard',
    component: './CandidateDashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
