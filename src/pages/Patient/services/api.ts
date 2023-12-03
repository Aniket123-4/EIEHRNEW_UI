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
export async function requestGetInvGroup(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/GetInvGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetInvestigation(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/GetInvParameterMasterList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetInvUnit(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/GetInvestigationUnit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetInvParameter(body: any, options?: { [key: string]: any }) {
  return request<any>('MasterForm/api/GetInvParameter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetPatientType(options?: { [key: string]: any }) {
  return request<any>('MasterForm/vPatientType', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}







