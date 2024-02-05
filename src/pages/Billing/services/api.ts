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