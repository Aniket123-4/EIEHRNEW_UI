// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function requestGetGender(options?: { [key: string]: any }) {
  return request<any>('/Common/Getgender', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function requestGetUserType(options?: { [key: string]: any }) {
  return request<any>('/Login/GetUserType', {
    method: 'GET',
    ...(options || {}),
  });
}
export async function requestGetRank(options?: { [key: string]: any }) {
  return request<any>('/Login/GetRank', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function requestGetRole(body: API.GetRole, options?: { [key: string]: any }) {
  return request<any>('/Login/GetRole?RoleID=' + body.RoleID, {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    // data: body,
    ...(options || {}),
  });
}
export async function requestGetRoleBAction(body: API.GetRoleBAction, options?: { [key: string]: any }) {
  return request<any>('/Login/GetRoleBaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetForm(body: API.GetForm, options?: { [key: string]: any }) {
  return request<any>('/Login/GetForm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetOrg(body: API.GetOrg, options?: { [key: string]: any }) {
  return request<any>('/Login/GetOrg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetMmodule(body: API.GetOrg, options?: { [key: string]: any }) {
  return request<any>('/Login/GetModule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetSectionTree(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/GetSectionTree', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),

  });
}
export async function requestGetDesignation(body: API.GetDesignation, options?: { [key: string]: any }) {
  return request<any>('/Login/GetDesignation?DesigID=' + body.DesigID, {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    data: body,
    ...(options || {}),

  });
}
export async function requestGetPackages(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/GetPackage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),

  });
}


export async function requestGetMarital(options?: { [key: string]: any }) {
  return request<any>('/Common/GetMarital', {
    method: 'GET',
    ...(options || {}),
  });
}


/**  POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestGetState(body: any = {}, options?: { [key: string]: any }) {
  return request<any>(`/Common/GetState?StateID=-1&UserID=-1&FormID=-1&Type=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function requestGetDistrict(body: any = {}, options?: { [key: string]: any }) {
  console.log(body);
  return request<any>(`/Common/GetDistrict?DistrictID=-1&StateID=${body.value}&UserID=-1&FormID=-1&Type=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function requestGetArea(body: any = {}, options?: { [key: string]: any }) {
  return request<any>(`Common/GetArea?AreaID=-1&DistrictID=-1&StateID=${-1}&UserID=-1&FormID=-1&Type=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function requestGetCity(body: any = {}, options?: { [key: string]: any }) {
  return request<any>(`/Common/GetCity?CityID=-1&ULBypeid=-1&DistrictID=${body.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function requestGetBranch(body: any = {}, options?: { [key: string]: any }) {
  console.log(body);
  return request<any>(`Common/GetBranch?BranchID=-1&IsActive=1&UserID=-1&FormID=-1&Type=1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


export async function requestGetRoomType(body: any, options?: { [key: string]: any }) {
  return request<any>('/Room/GetRoomType?RoomTypeID=-1&IsActive=1&UserID=-1&FormID=-1&Type=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetComplaintType(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/api/GetComplaintType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetRateType(body: any, options?: { [key: string]: any }) {
  return request<any>('Common/GetrateType?RateTypeID=-1&IsActive=-1&UserID=-1&FormID=-1&Type=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetSlot(options?: { [key: string]: any }) {
  return request<any>('/Common/GetSlot', {
    method: 'GET',
    ...(options || {}),
  });
}



export async function requestGetSection(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/GetSection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetUserList(
  params: {
    // query
    CommonID?: number;
    /** 页面的容量 */
    Type?: number;
  },
  options?: { [key: string]: any },
) {
  console.log(params)
  return request<any>('/Login/GetUserList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
