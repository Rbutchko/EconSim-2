//  new order system handling. see documentation for details. will document this more in future

function performTransaction(buyOrder, sellOrder) {
	// error checking
	if(buyOrder.resource != sellOrder.resource) {
		console.error('Resrouce mismatch in performTransaction');
		return false;
	}

	if(buyOrder.resource == 'money') {
		console.error('Why are you trying to buy money? In performTransaction');
		return false;	
	}

	if(buyOrder.complete || sellOrder.complete) {
		// below error means that the loop in manageTransactions below that calls this function
		// failed to splice a completed order before calling performTransaction
		console.error('A', (buyOrder.complete ? 'buy' : 'sell')  , 'order is already complete performTransaction');
		return false;
	}

	if(buyOrder.price < sellOrder.price) {
		console.error('Buyer and seller prices do not allign in performTransaction');
		return false;
	}

	let amount = Math.min(buyOrder.amount, sellOrder.amount);
	let price = sellOrder.price;
	let resource = sellOrder.resource;

	let seller = AIs[sellOrder.firmNum];
	let buyer = AIs[buyOrder.firmNum];

	// bellow is borrowed from old trade function

	if(!seller.has(resource, amount) ) {
		console.error('Not enough of resource', resource, 'Seller has', seller.has(resource, amount) );
		return false;
	}
	if(!buyer.has('money', price*amount) ) {
		console.error('Not enough money Buyer has', buyer.has('money', price*amount) );
		return false;
	}

	seller.give(buyer, resource, amount);
	buyer.give(seller, 'money', price*amount);

	seller.prevAmountSold += amount;
	activity += amount;

	sellOrder.updateOrder(amount);
	buyOrder.updateOrder(amount);

	// console.log('traded', seller, buyer, resource, amount, price);
	return true;
}

function manageTransacitons(sellOrders, buyers) {

	let avgPrices = getAvgPrices(sellOrders);

	let buyOrders = [];
	for(let buyer of buyers) {
		let orders = buyer.getBuyOrders(avgPrices);
		for(let order of orders) {
			buyOrders.push(order);
		}
	}

	// we now have our sell and buy orders
	// special math and logic between buy and sell orders below:


	for(let resource of RESOURCE_TYPES) {
		if(resource=='money') continue;

		let currentSells = sellOrders.filter(x => x.resource == resource && isValidOrder(x) );
		let currentBuys = buyOrders.filter(x => x.resource == resource && isValidOrder(x) );

		// a-b is ascending, b-a is descending
		// sell orders are by chespest first, buy orders are shuffled
		currentSells.sort( (a, b) => a.price - b.price);
		currentBuys.sort( (a, b) => Math.random() > 0.5 ? 1 : -1);

		// orders are now organized by resource, then sorted by price
		// buy orders are shuffled
		// we've filtered out invalid orders


		// let buyIdxs = [...Array(currentBuys.length).keys()]; // list of nums 0 to n-1
		// shuffle(buyIdxs);

		// perform transaction
		for(sellIdx in currentSells) {
			let toExit = false;
			for(buyIdx in currentBuys) {
				if(currentSells[sellIdx].price < currentBuys[buyIdx].price) {
					performTransaction(currentBuys[buyIdx], currentSells[sellIdx]);
					if(currentSells[sellIdx].complete) {
						currentSells.splice(sellIdx, 1);
						sellIdx--;
						break; // go to outter loop / next seller
					}
					if(currentBuys[buyIdx].complete) {
						currentBuys.splice(buyIdx, 1);
						buyIdx--; // account for effect of splicing on idx, so next item isn't skipped
					}
				}
				else {
					// if buyer asks for too little (cheaper than the cheapest price available)
					// since sell orders are sorted by price
					// then remove the buy order
					currentBuys.splice(buyIdx, 1);
					buyIdx--;
				}
			}
		}
	}
}

function isValidOrder(o) {
	if(o.complete) return false;
	// unncessary: checking if o.resource is money, checking if o.amount is positive

	if(o.type=='sell') {
		if(! AIs[o.firmNum].has(o.resource, o.amount) ) return false;
	}
	else { // 'buy'
		if(! AIs[o.firmNum].has('money', o.price*o.amount) ) return false;
	}
	return true;
}

// currently mean, median would be less skewed and should be used in future
function getAvgPrices(sellOrders) {
	let priceInfo = {
		bread: {
			amountForSale: 0,
			priceTotal: 0
		},
		ore: {
			amountForSale: 0,
			priceTotal: 0
		},
		lumber: {
			amountForSale: 0,
			priceTotal: 0
		},
		metal: {
			amountForSale: 0,
			priceTotal: 0
		},
		wheat: {
			amountForSale: 0,
			priceTotal: 0
		},
		flour: {
			amountForSale: 0,
			priceTotal: 0
		},
		tools: {
			amountForSale: 0,
			priceTotal: 0
		},
	};

	for(let sellOrder of sellOrders) {
		let resource = sellOrder.resource;
		if(resource == 'money') continue;
		priceInfo[resource].amountForSale += sellOrder.amount;
		priceInfo[resource].priceTotal += sellOrder.price* sellOrder.amount;
	}

	let avgPrices = {};
	for(let resource of RESOURCE_TYPES) {
		let info = priceInfo[resource];
		if(info.amountForSale==0 || info.priceTotal==0) {
			avgPrices[resource] = -1;
		}
		else {
			avgPrices[resource] = info.priceTotal / info.amountForSale;
		}
	}
	return avgPrices;
}