/**
 * Utility function to convert a string to a DataView
 * @param value - The string to convert
 * @returns DataView representation of the string
 */
const textToDataView = (value: string): DataView => {
		const newValue = value.split('').map((s) => s.charCodeAt(0));
		return new DataView(Uint8Array.from(newValue).buffer);
};

/**
 * Interface for the receipt details
 */
interface ReceiptDetails {
		shopName: string;
		guestName: string;
		selectedProducts: { name: string; quantity: number; price: number }[];
		cashierName: string;
}

/**
 * PrinterService class for managing Bluetooth printer connection and printing
 */
class PrinterService {
	private device: BluetoothDevice | null = null;
	private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
	private service: BluetoothRemoteGATTService | null = null;

	/**
	 * Connects to the Bluetooth printer
	 * @throws Error if connection fails
	 */
	async connect(): Promise<void> {
		try {
			const devices =  await navigator.bluetooth.getDevices();

			if(devices.filter(name=>name.name=="RPP02N").length==0){
				// Request the device
				this.device = await navigator.bluetooth.requestDevice({
					filters: [
						{ namePrefix: 'RPP02N' },
						{ services: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2']}
					]
				});
			}
			else{
				this.device = devices.find(name=>name.name=="RPP02N") || null;
			}

			this.device?.addEventListener('gattserverdisconnected', this.onDisconnected);

			console.log('Device selected:', this.device);

			// Connect to GATT server
			const server = await this.device?.gatt?.connect();
			if (!server) throw new Error('Failed to connect to GATT server.');

			console.log('Connected to GATT server:', server);

			// Get the desired service and characteristic
			this.service = await server.getPrimaryService('e7810a71-73ae-499d-8c15-faa9aef0c3f2'); // Replace with your printer's service UUID
			this.characteristic = await this.service.getCharacteristic('bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'); // Replace with your printer's characteristic UUID

			console.log('Connected to service and characteristic');
			} catch (error) {
				console.error('Error during connection:', error);
				throw new Error('Failed to connect to the printer.');
			}
		}

	async onDisconnected(event: any) {
		console.log(event);
		const devices =  await navigator.bluetooth.getDevices();

		if(devices.filter(name=>name.name=="RPP02N").length==0){
			// Request the device
			this.device = await navigator.bluetooth.requestDevice({
				filters: [
					{ namePrefix: 'RPP02N' },
					{ services: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2']}
				]
			});
		}
		else{
			this.device = devices.find(name=>name.name=="RPP02N") || null;
		}

		// Connect to GATT server
		const server = await this.device?.gatt?.connect();
		if (!server) throw new Error('Failed to connect to GATT server.');
	}

	/**
	 * Prints a receipt using the connected printer
	 * @param details - The receipt details
	 * @throws Error if printing fails
	 */
	async printReceipt(details: ReceiptDetails): Promise<void> {
		if (!this.characteristic) {
				throw new Error('Printer is not connected.');
		}

		const { shopName, guestName, selectedProducts, cashierName } = details;

		const boldOn = new Uint8Array([27, 69, 1]);
		const boldOff = new Uint8Array([27, 69, 0]);
		const left = new Uint8Array([27, 97, 0]);
		const center = new Uint8Array([27, 97, 1]);
		const right = new Uint8Array([27, 97, 2]);
		const lineFeed = new Uint8Array([10]);
		const underLine = textToDataView('-'.repeat(30));
		const newEmptyLine = textToDataView(`${' '.repeat(18)}\n`);
		const currentDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

		try {
			await this.characteristic.writeValue(new DataView(boldOn.buffer));
			await this.characteristic.writeValue(new DataView(center.buffer));
			await this.characteristic.writeValue(textToDataView(shopName)); // Header
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			await this.characteristic.writeValue(new DataView(boldOff.buffer));
			await this.characteristic.writeValue(underLine);
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			await this.characteristic.writeValue(new DataView(right.buffer));
			await this.characteristic.writeValue(textToDataView(currentDate)); //date
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			await this.characteristic.writeValue(new DataView(left.buffer));


			await this.characteristic.writeValue(textToDataView(`Customer: ${guestName}`));
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));

			for (const product of selectedProducts) {
				await this.characteristic.writeValue(new DataView(left.buffer));
				const productLine = `${product.name.padEnd(12)}`;
				await this.characteristic.writeValue(textToDataView(productLine));
				await this.characteristic.writeValue(new DataView(lineFeed.buffer));

				await this.characteristic.writeValue(new DataView(right.buffer));
				const productDetailLine = `${"".padEnd(12)} ${product.quantity} x ${product.price} = ${product.quantity * product.price}`;
				await this.characteristic.writeValue(textToDataView(productDetailLine));
				await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			}
			await this.characteristic.writeValue(textToDataView(`Qty: ${selectedProducts.reduce((sum, product) => sum + product.quantity, 0)}`));
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			await this.characteristic.writeValue(textToDataView(`Total: Rp. ${selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)}`));
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			await this.characteristic.writeValue(newEmptyLine);
			await this.characteristic.writeValue(new DataView(center.buffer));
			await this.characteristic.writeValue(textToDataView(`Cashier : ${cashierName}`));
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			await this.characteristic.writeValue(new DataView(left.buffer));			
			await this.characteristic.writeValue(textToDataView('---Thank you---'));
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));
			await this.characteristic.writeValue(newEmptyLine);
			await this.characteristic.writeValue(new DataView(lineFeed.buffer));

			console.log('Receipt printed successfully!');
		} catch (error) {
			console.error('Error during printing:', error);
			throw new Error('Failed to print the receipt.');
		}
	}
}

export default PrinterService;

