// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */

//add new institute
export async function requestAddInstitute(body: API.AddInstituteParam, options?: { [key: string]: any }) {
  console.log(body)
  return request<any>('Institute/AddInstitute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
//getInstitute data
export async function requestGetInstituteList(body: API.GetInstituteListParams, options?: { [key: string]: any }) {
  console.log(body)
  return request<any>('/Institute/GetInstituteList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
//addInstitute image
export async function requestAddInstituteImage(body: API.GetInstituteListParams, options?: { [key: string]: any }) {
  console.log(body)
  return request<any>('/Institute/AddInstituteImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
