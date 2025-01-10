export const getGrandTotal = (products:any, discount:any) => {
	const totalAmount = products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + product.price * product.quantity, 0).toFixed(2);

	const intDisc = Number(discount);
	const discountPrice = (intDisc * totalAmount)/100
	const grandTotalAmount = totalAmount - discountPrice

	return grandTotalAmount;
};