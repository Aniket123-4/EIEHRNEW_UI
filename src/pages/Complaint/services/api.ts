// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestAddComplaint(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/api/AddUpdateComplaintType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestAddDisease(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/AddUpdateDisease', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddInvParameter(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/AddUpdateInvParameter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddInvUnit(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/AddUpdateInvUnit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestDiseaseList(body: any, options?: { [key: string]: any }) {
  return request<any>('/MasterForm/api/GetDisease', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestSpecialList(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/vSpecialDiseaseType', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestDiseaseTypeList(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/GetDiseaseType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddInvGroup(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/AddUpdateInvGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


/**  POST /api/login/account */
export async function requestGetRoomList(body: any, options?: { [key: string]: any }) {
  return request<any>('/Room/RoomList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}





