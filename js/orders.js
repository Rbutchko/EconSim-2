// buy and sell order classes

// for ordering a single resource
class Order {
	constructor(type, firmNum, resource, price, amount) {
		this.type = type; // 'buy' or 'sell'
		this.firmNum = firmNum;
		this.resource = resource;
		this.price = price;
		this.amount = amount;
		this.complete = false;
	}
	updateOrder(amountCompleted) {
		if(this.amount < amountCompleted) {
			console.error('Over-ordered', this);
			return false;
		}
		this.amount -= amountCompleted;
		this.complete = this.isComplete();
		return true;
	}
	isComplete() {
		return this.amount == 0;
	}
	// addOrder(newOrder, combineStrategy='') {
	// 	// combineStrategy is 'min', 'max', 'avg', 'prev', or 'new' for taking lowest or highest price for each resource
	// 	if(newOrder.firmNum != this.firmNum) {
	// 		console.error('Firm numbers don\'t match', newOrder.firmNum, this.firmNum);
	// 		return false;
	// 	}
	// 	if(newOrder.type != this.type) {
	// 		console.error('Order types don\'t match', newOrder.type, this.type);
	// 		return false;
	// 	}
	// 	if(newOrder.complete || this.complete) {
	// 		console.warn('An order is already complete', newOrder.compelte, this.compelte);
	// 		return false;
	// 	}

	// 	if(newOrder.resource != this.resource) {
	// 		console.error('Orders must be of same resource. Use MultiOrder class for complex orders', newOrder.resource, this.resource);
	// 		return false;
	// 	}
	// 	if(newOrder.price != this.price && combineStrategy=='') {
	// 		console.error('No combine strategy given for orders of different prices', newOrder.price, this.price);
	// 		return false;
	// 	}

	// 	this.amount += newOrder.amount;

	// 	switch(combineStrategy) {
	// 		case 'min':
	// 			this.price = Math.min(newOrder.price, this.price);
	// 			break;

	// 		case 'max':
	// 			this.price = Math.max(newOrder.price, this.price);
	// 			break;

	// 		case 'avg':
	// 			this.price = Math.round( (newOrder.price + this.price) / 2);
	// 			break;

	// 		case 'new':
	// 			this.price = newOrder.price;
	// 			break;

	// 		// no need to handle below; price remains the same
	// 		// case 'prev':
	// 		// 	break;
	// 	}

	// 	return true;
	// }
}

/*
// for ordering multiple resources
class MultiOrder {
	constructor(type, firmNum, resource) {
		this.type = type; // 'buy' or 'sell'
		this.firmNum = firmNum;
		this.resources = resources; // object of resources with keys of resource name and values with price and amount
		this.complete = false;
	}
	toOrders() {
		// export to multiple single order classes
		let rtn = [];
		for(resource in resources) {
			rtn.push(new Order(this.type, this.firmNum, resource, resources[resource].price, resources[resource].amount) );
		}
		return rtn;

	}
	updateOrder(resource, amountCompleted) {
		if(this.resources[resource].amount < amountCompleted) {
			console.error('Over-ordered', this);
			return false;
		}
		this.resources[resource].amount -= amountCompleted;
		this.complete = this.isComplete();
		return true;
	}
	addOrder(newOrder, combineStrategy) {
		// below is copied from addOrder above
		// combineStrategy is 'min', 'max', 'avg', 'prev', or 'new' for taking lowest or highest price for each resource
		if(newOrder.firmNum != this.firmNum) {
			console.error('Firm numbers don\'t match', newOrder.firmNum, this.firmNum);
			return false;
		}
		if(newOrder.type != this.type) {
			console.error('Order types don\'t match', newOrder.type, this.type);
			return false;
		}
		if(newOrder.complete || this.complete) {
			console.warn('An order is already complete', newOrder.compelte, this.compelte);
			return false;
		}

		for(resource in newOrder) {
			if(! this.resources[resource]) {
				this.resources[resource] = {};
				this.resources[resource].amount = 0;
				this.resources[resource].price = newOrder.resources[resource].price;
			}
			else {
				// takes new price regardless if current order is missing resource
				switch(combineStrategy) {
					case 'min':
						this.resources[resource].price = Math.min(newOrder.resources[resource].price, this.resources[resource].price);
						break;

					case 'max':
						this.resources[resource].price = Math.max(newOrder.resources[resource].price, this.resources[resource].price);
						break;

					case 'avg':
						this.resources[resource].price = Math.round( (newOrder.resources[resource].price + this.resources[resource].price) / 2);
						break;

					case 'new':
						this.resources[resource].price = newOrder.resources[resource].price;
						break;

					// no need to handle below; price remains the same unless resource is missing, which is handled above
					// case 'prev':
					// 	break;
				}
			}
			this.resources[resource].amount += newOrder.resources[resource].amount;
		}

		return true;
	}
	isComplete() {
		for(resource in this.resources) {
			if(this.resources[resource].amount != 0) {
				return false;
			}
		}
		return true;
	}
}
*/