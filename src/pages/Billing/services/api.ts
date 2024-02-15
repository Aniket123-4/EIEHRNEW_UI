import { request } from '@umijs/max';


export async function requestGetHospitalBill(body: any, options?: { [key: string]: any }) {
    return request<any>('/Reports/GetHospitalBill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function requestAddPatientPharmaBill(body: any, options?: { [key: string]: any }) {
    return request<any>('AddPatientPharmaBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
export async function requestGetPatientPharmaBill(body: any, options?: { [key: string]: any }) {
    return request<any>('GetPatientPharmaBill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
export async function requestGetItemBalanceWithBaarCode(body: any, options?: { [key: string]: any }) {
    return request<any>('InventoryForm/GetItemBalanceWithBaarCode_1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }