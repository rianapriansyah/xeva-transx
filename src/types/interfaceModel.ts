export interface SelectedProduct {
	id: number;
	transactionId:number;
	productId:number;
	name:string;
	price:number;
	quantity:number;
	total:number;
}

export interface Product {
  id: number;
  transactionId:number;
  productId:number;
  name:string;
  price:number;
  quantity:number;
  total:number;
  kitchen:string;
  category:string;
}

export interface Category {
  id: number;
  name:string;
}

export interface Guest {
  id:number;
  name: string;
  table:string;
}

export interface Transaction {
  id: number;
  userId:string;
  paymentMethodId: number;
  totalAmount: number;
  paid: boolean;
  tableNo:string
  guestName:string
  note:string;
  grandTotalAmount:number;
  discount:string;
  transactionDetails: SelectedProduct[];
  createdAt:string;
}