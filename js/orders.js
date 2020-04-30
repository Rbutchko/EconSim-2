/**
* @author justingolden21
* imported by firm, player
* 
* Provides the order class for organizing market trading
* New Orders are created by firms' getBuyOrders and getSellOrders functions
* Those Orders are received by and handled in main and market
*/

/**
* @class Order - Represents an order of a single resource
*/
export class Order {
	/**
	* @param {String} type - The order type ('buy' or 'sell')
	* @param {Number} firmNum - The firm number of the firm placing the order
	* @param {String} resource - The name of the resource being ordered
	* @param {Number} price - The max price for a buy order, or min price for a sell order
	* @param {Number} amount - The amount of the resource to be ordered
	*/
	constructor(type, firmNum, resource, price, amount) {
		this.type = type;
		this.firmNum = firmNum;
		this.resource = resource;
		this.price = price;
		this.amount = amount;

		this.complete = false;
	}
	/**
	* Update an order status with the amount completed
	* @param {Number} amountCompleted - The amount of the order completed
	*/
	updateOrder(amountCompleted) {
		if(this.amount < amountCompleted) {
			console.error('Over-ordered', this);
			return;
		}

		this.amount -= amountCompleted;

		if(this.amount == 0) {
			this.complete = true;
			this.onComplete();
		}
	}
	/**
	* Called upon order completion. Meant to be overridden
	*/
	onComplete() {
		return true;
	}
}
