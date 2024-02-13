import { IAddress } from './address';

export interface OrderToCreate
{
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: IAddress;
}


export interface Order
 {
  id: number
  buyerEmail: string
  orderTime: string
  shipToAddress: IAddress
  deliveryMethod: string
  shippingPrice: number
  orderItems: IOrderItem[]
  subtotal: number
  total: number
  status: string
  
}


export interface IOrderItem
 {
  productId: number
  productName: string
  pictureUrl: string
  price: number
  quantity: number
}
