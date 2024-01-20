// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/**  POST /api/login/account */
export async function requestGetItem(body: any, options?: { [key: string]: any }) {
    return request<any>('InventoryForm/GetItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
export async function requestAddDirectItemReceipt(body: any, options?: { [key: string]: any }) {
    return request<any>('InventoryForm/AddDirectItemReceipt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
export async function requestGetDirectItem(body: any, options?: { [key: string]: any }) {
    return request<any>('InventoryForm/GetDirectItemReceipt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
export async function requestGetItemBalance(body: any, options?: { [key: string]: any }) {
    return request<any>('InventoryForm/GetItemBalance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}