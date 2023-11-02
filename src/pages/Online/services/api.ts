// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestAddOnlineLogin(body: any, options?: { [key: string]: any }) {
  return request<any>('AddOnlineLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddPatient(body: any, options?: { [key: string]: any }) {
  return request<any>('AddPatRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetAppointData(body: any, options?: { [key: string]: any }) {
  return request<any>('GetAppointData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

