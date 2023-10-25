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





