/**
* @author justingolden21
* imported by main
* 
* Logic that handles market tick / order system
* Firms can each place buy and sell orders
* Main obtains sell orders and calls manageTransactions with sell orders and buyer firms
* manageTransactions loops through and logically pairs sellers with buyers
* manageTransactions calls performTransaction, which completes a sale between buyer and seller
*/

import { RESOURCE_TYPES } from './util.js';
import { AIs } from './firm.js';
import { addActivity } from './main.js';

/**
* Performs a transaction between buyer and seller
* @param {Object - Order} buyOrder - the buyer's order to purchase the resource
* @param {Object - Order} sellOrder - the seller's order to sell the resource
* @return {Boolean} success - returns true if transaction was completed, false otherwise
* 
* Orders should be compatible resource and prices
* The function that calls performTransaction should check first
* Performs basic error checking
* 
* Uses the seller's price, and the minimum amount between the buy and sell orders
* Buyer and seller exchange resources
* Updates seller's amount sold and the total activity for this market tick
* Finally, updates the Order objects
*/
function performTransaction(buyOrder, sellOrder) {
	// Basic error checking
	if(buyOrder.resource != sellOrder.resource) {
		console.error('performTransaction: Resrouce mismatch');
		return false;
	}
	if(buyOrder.resource == 'money') {
		console.error('performTransaction: Attempting to buy money');
		return false;	
	}
	if(buyOrder.complete || sellOrder.complete) {
		/** 
		* The below error means that the loop in manageTransactions
		* that calls this function failed to splice a completed order
		* before calling performTransaction
		*/
		console.error('performTransaction: A', (buyOrder.complete?'buy':'sell'), 'order is already complete');
		return false;
	}
	if(buyOrder.price < sellOrder.price) {
		console.error('performTransaction: Buyer and seller prices do not allign');
		return false;
	}

	// Prepare for transaction
	let amount = Math.min(buyOrder.amount, sellOrder.amount);
	let price = sellOrder.price;
	let resource = sellOrder.resource;

	let seller = AIs[sellOrder.firmNum];
	let buyer = AIs[buyOrder.firmNum];

	// Make sure buyer and seller can afford to complete transaction
	if(!seller.has(resource, amount) ) {
		console.error('Not enough of resource', resource, 'Seller has', seller.has(resource, amount) );
		return false;
	}
	if(!buyer.has('money', price*amount) ) {
		console.error('Not enough money Buyer has', buyer.has('money', price*amount) );
		return false;
	}

	// Perform the transaction
	seller.give(buyer, resource, amount);
	buyer.give(seller, 'money', price*amount);

	seller.prevAmountSold += amount;
	addActivity(amount);

	sellOrder.updateOrder(amount);
	buyOrder.updateOrder(amount);

	return true;
}

/**
* Manages transactions between buyers and sellers
* @param {Object Array - Order Array} sellOrders - list of sell orders to be completed
* @param {Object Array - Firm Array} buyers - list of firms who may be interested in buying
* 
* Obtains pricing data, then passes data onto the buyers to collect their orders
* After collecting buy and sell orders, sorts them
* Orders are sorted by resource, then sell orders by price and buy orders randomly
* Invalid and completed orders are filtered out
* 
* Loops through all sell orders for each resource and finds buyers with appropriate prices
* Performs the transaction, then checks for completed orders
* If the sell order is complete, it removes the the order and moves on to the next seller
* If the buy order is complete it's removed 
*/
export function manageTransacitons(sellOrders, buyers) {
	// Obtain price info and buy orders

	// Do NOT cut paste this inside the loop below (inefficient)
	let avgPrices = getAvgPrices(sellOrders);

	let buyOrders = [];
	for(let buyer of buyers) {
		let orders = buyer.getBuyOrders(avgPrices);
		for(let order of orders) {
			buyOrders.push(order);
		}
	}

	// We now have buy and sell orders
	// Below is logic to pair buy and sell orders together

	for(let resource of RESOURCE_TYPES) {
		if(resource=='money') continue;

		let currentSells = sellOrders.filter(x => x.resource == resource && isValidOrder(x) );
		let currentBuys = buyOrders.filter(x => x.resource == resource && isValidOrder(x) );

		// note: a-b is ascending, b-a is descending
		// sell orders are sorted by chespest first, buy orders are shuffled
		currentSells.sort( (a, b) => a.price - b.price);
		currentBuys.sort( (a, b) => Math.random() > 0.5 ? 1 : -1);

		// invalid orders are filtered out
		// orders are organized by resource
		// sell orders are sorted by price
		// buy orders are shuffled

		// perform transaction
		for(let sellIdx in currentSells) {
			for(let buyIdx in currentBuys) {
				if(currentSells[sellIdx].price < currentBuys[buyIdx].price) {
					performTransaction(currentBuys[buyIdx], currentSells[sellIdx]);

					// must check buy complete before sell
					// because sell complete would break out of the loop
					if(currentBuys[buyIdx].complete) {
						currentBuys.splice(buyIdx, 1);
						// account for effect of splicing on idx
						// so next item isn't skipped
						buyIdx--;
					}
					if(currentSells[sellIdx].complete) {
						currentSells.splice(sellIdx, 1);
						sellIdx--;
						break; // go to outter loop / next seller
					}					
				}
				else {
					// If the buy and sell order are incompatible,
					// the buyer's price is too low for all sellers
					// because sell orders are sorted by cheapest price first
					// so the buy order is removed
					currentBuys.splice(buyIdx, 1);
					buyIdx--;
				}
			}
		}
	}
}

/**
* Checks if an order is valid
* @param {Object - Order} o - the order to check
* @return {Boolean} isValid - if the order is valid
* Checks if the order has sufficient money (buy) or resources (sell)
* 
* No need to check if o.resource == 'money' (filtered out by the loop in manageTransactions)
* No need to check if o.amount > 0, (o.complete property is always up to date)
*/
function isValidOrder(o) {
	if(o.complete) return false;
	if(o.type=='sell' && (!AIs[o.firmNum].has(o.resource, o.amount) ) ) return false;	
	if(o.type=='buy' && (! AIs[o.firmNum].has('money', o.price*o.amount) ) ) return false;
	return true;
}

/**
* @param {Object Array - Order Array} sellOrders - list of orders for which prices will be calculated
* @return {Object - PriceInfo} - Keys are resources and values are their average prices 
* Mean prices are returned, weighed by sell order amount
* If none of a resource is for sale, it will have price -1
* @todo Currently uses mean. Median would be less skewed and should be used in the future
*/
function getAvgPrices(sellOrders) {
	let priceInfo = {};
	for(let resource of RESOURCE_TYPES) {
		priceInfo[resource] = {
			amountForSale: 0,
			priceTotal: 0
		}
	}

	for(let o of sellOrders) {
		if(o.resource == 'money') continue;
		priceInfo[o.resource].amountForSale += o.amount;
		priceInfo[o.resource].priceTotal += o.price * o.amount;
	}

	let avgPrices = {};
	for(let resource of RESOURCE_TYPES) {
		let info = priceInfo[resource];
		if(info.amountForSale==0) {
			avgPrices[resource] = -1;
		}
		else {
			avgPrices[resource] = info.priceTotal / info.amountForSale;
		}
	}
	return avgPrices;
}