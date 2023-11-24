// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestAddOnlineLogin(body: any, options?: { [key: string]: any }) {
  return request<any>('Online/AddOnlineLogin', {
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
  return request<any>('Online/GetAppointData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetPatientList(body: any, options?: { [key: string]: any }) {
  return request<any>('Online/GetAppointData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetAppointmentSearchList(body: any, options?: { [key: string]: any }) {
  return request<any>('Online/GetAppointmentSearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetDoctorList(body: any, options?: { [key: string]: any }) {
  return request<any>('Login/GetUserList?CommonID=-1&Type=3', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestSyncOnlinePatient(body: any, options?: { [key: string]: any }) {
  return request<any>('/Online/SyncOnlinePatient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

