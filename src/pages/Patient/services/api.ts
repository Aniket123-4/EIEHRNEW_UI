// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function requestGetPatientSearch(body: any, options?: { [key: string]: any }) {
  return request<any>('/GetPatientSearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestPatientRegistration(body: any, options?: { [key: string]: any }) {
  return request<any>('AddUpdatePatient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestFileUpload(body: any) {
  return request<any>('MasterForm/UploadFileAsync', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': '*/*'
    },
    data: body,
  });
}
export async function requestAddOnlinePatDoc(body: any) {
  return request<any>('Online/AddOnlinePatDoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': '*/*'
    },
    data: body,
  });
}

export async function requestGetPatientHeader(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientHeader', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetPatientDoc(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientDoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestAddUpdatePatientDoc(body: any, options?: { [key: string]: any }) {
  return request<any>('AddUpdatePatientDoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestFnGetPatientSearch(body: any, options?: { [key: string]: any }) {
  return request<any>('FnGetPatientSearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetPatientVisitNo(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientVisitNo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetPatientByTokenNo(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientByTokenNo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestUpdatePatientTokenNo(body: any, options?: { [key: string]: any }) {
  return request<any>('UpdatePatientTokenNo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetCheckOutPatient(body: any, options?: { [key: string]: any }) {
  return request<any>('GetCheckOutPatient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetTokenNoQueueJump(body: any, options?: { [key: string]: any }) {
  return request<any>('GetTokenNoQueueJump', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetPatientCheckOutInfo(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientCheckOutInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestUpdateCaseCheckOut(body: any, options?: { [key: string]: any }) {
  return request<any>('UpdateCaseCheckOut', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestUpdateBulkCaseCheckOut(body: any, options?: { [key: string]: any }) {
  return request<any>('UpdateBulkCaseCheckOut', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestUpdateCaseCheckIn(body: any, options?: { [key: string]: any }) {
  return request<any>('UpdatePatientStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetDoctorPatientList(body: any, options?: { [key: string]: any }) {
  return request<any>('Reports/GetDoctorWiseAna', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}



export async function requestGetPatientBill(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientBill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function requestGetPatientBillReport(body: any, options?: { [key: string]: any }) {
  return request<any>('Reports/GetPatientBill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestAddPatientBill(body: any, options?: { [key: string]: any }) {
  return request<any>('AddPatientBill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function requestGetPatientBillNo(body: any, options?: { [key: string]: any }) {
  return request<any>('GetPatientBillNo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}









