

// export interface CategoyModel {
//     _id: string;
//     title: string;
//     parentId: string;
//     slug: string;
//     description: string;
//     createdAt: string;
//     updatedAt: string;
//     _v: number;
// }

// export interface ProductModel {
// 	_id: string;
// 	title: string;
// 	slug: string;
// 	description: string;
// 	categories: string[];
// 	supplier: string;
// 	createdAt: string;
// 	updatedAt: string;
// 	__v: number;
// 	isDeleted: boolean;
// 	subItems: SubProductModel[];
// }

// export interface SubProductModel {
// 	size: string;
// 	color: string;
// 	price: number;
// 	qty: number;
// 	productId: string;
// 	images: any[];
// 	_id: string;
// 	createdAt: string;
// 	updatedAt: string;
// 	__v: number;
// }

export interface CategoyModel {
	_id: string;
	title: string;
	parentId: string;
	slug: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	image?: string;
	children: CategoyModel[];
	__v: number;
}

export interface ProductModel {
	_id: string;
	title: string;
	slug: string;
	description: string;
	categories: string[];
	images: string[];
	supplier: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	isDeleted: boolean;
	subItems: SubProductModel[];
	price: number[];
}

export interface SubProductModel {
	size: string;
	color: string;
	price: number;
	qty: number;
	productId: string;
	images: any[];
	_id: string;
	createdAt: string;
	discount?: number;
	updatedAt: string;
	__v: number;
	imgURL?: string;
	count: number;
	createdBy: string;
}

export interface AddressModel {
	name: string;
	phoneNumber: string;
	address: string;
	createdBy: string;
	isDefault: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface BillModel {
	_id: string;
	products: BillProductModel[];
	total: number;
	status: BillStatus;
	customer_id: string;
	shippingAddress: AddressModel;
	paymentStatus: PaymentStatus;
	paymentMethod: PaymentMethod;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

/** Trạng thái đơn hàng */
export enum BillStatus {
	PENDING = 0, // Chờ xác nhận
	IN_PROCESS = 1, // Đang xử lý
	DELIVERED = 2, // Đã giao
	CANCELED = 3, // Đã hủy
}

/** Trạng thái thanh toán */
export enum PaymentStatus {
	UNPAID = 0, // Chưa thanh toán
	PAID = 1, // Đã thanh toán
}

/** Phương thức thanh toán */
export type PaymentMethod = "cod" | "bank" | "paypal";

export interface BillProductModel {
	_id: string;
	title: string;
	size: string;
	color: string;
	qty: number;
	image: string;
}
