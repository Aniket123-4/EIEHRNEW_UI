// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/Institute/GetinstituteDetail */
export async function requestGetInstituteDetail(body: any, options?: { [key: string]: any }) {
  return request<any>('/Institute/GetinstituteDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


/**  POST /api/login/account */
export async function requestGetBookingDetails(body: any, options?: { [key: string]: any }) {
  return request<any>('/Booking/Getgetbookbill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**  POST /api/login/account */
export async function requestGetBookingOrderHistory(body: any, options?: { [key: string]: any }) {
  return request<any>('Booking/Getgetbookbill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


/**  POST /api/login/account */
export async function requestAddBooking(body: any, options?: { [key: string]: any }) {
  return request<any>('/Booking/AddBookbill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**  POST /api/Report/GetBookingReport*/
export async function requestGetBookingReport(body: any, options?: { [key: string]: any }) {
  return request<any>('Report/GetBookingReport', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${body.token}`,
    },
    data: body,
    ...(options || {}),
  });
}





