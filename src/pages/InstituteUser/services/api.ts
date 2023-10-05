// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestAddInstituteUser(body: any, options?: { [key: string]: any },token?: string) {
  //console.log("token " + JSON.stringify( body.token) )
  return request<any>('/Institute/AddInstituteUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${body.token}`,
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestUpdateInstituteUser(body: any, options?: { [key: string]: any },token?: string) {
  //console.log("token " + JSON.stringify( body.token) )
  return request<any>('/Institute/UpdateInstituteUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${body.token}`,
    },
    data: body,
    ...(options || {}),
  });
}


/**  POST menus */
export async function mo(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/Login/GetUserPermission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function requestGetCandidateList(body: any, options?: { [key: string]: any }) {
  return request<any>('/Candidate/GetCandidateList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getCandidategetList(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
