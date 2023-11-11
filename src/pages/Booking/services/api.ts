// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


export async function requestAddPatDocAppointments(body: any, options?: { [key: string]: any }) {
  return request<any>('/Online/AddPatDocAppointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

