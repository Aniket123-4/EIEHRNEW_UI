// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function requestGetPatientForDoctorOPIP(body: any, options?: { [key: string]: any }) {
    return request<any>('/GetPatientForDoctorOPIP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
  

export async function requestAddDelPatientForDoctorOPIP(body: any, options?: { [key: string]: any }) {
  return request<any>('/AddDelPatientForDoctorOPIP', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


  
export async function requestGetItemBalance(body: any, options?: { [key: string]: any }) {
  return request<any>('/InventoryForm/GetItemBalance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


  