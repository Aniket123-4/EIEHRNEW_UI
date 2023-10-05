// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestAddRoom(body: any, options?: { [key: string]: any }) {
  return request<any>('/Room/AddRoom', {
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





