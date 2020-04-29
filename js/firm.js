/**
* @author justingolden21
* imported by display, firms, and main
*/

import { random, normal01, subtractAllFrom } from './util.js';
import { getSeasonModifier } from './events.js';
import { Order } from './orders.js';

// @todo rename? "allFirms"? make it an object?
// make a function to get the firm at firmnum as key?
export let AIs = [];

export let currentFirmNum = 0;
export let numBankrupt = 0;

export const TRADE_INTERVAL = 3;
const UPKEEP_INTERVAL_SIZE = 14;

/**
* @class Firm - All firms inherit from this
* @abstract
*/
export class Firm {
	/**
	* @param {Object - Inventory} startInventory - The firm's default inventory upon creation
	*/
	constructor(startInventory) {
		/**
		* @property {Object - Inventory} inventory
		* The resources at the firm's disposal
		* Note: Player firms all share the same inventory
		*/
		this.inventory = {
			'money' :  startInventory.money  || 0,
			'bread' :  startInventory.bread  || 0,
			'ore'   :  startInventory.ore    || 0,
			'lumber':  startInventory.lumber || 0,
			'metal' :  startInventory.metal  || 0,
			'wheat' :  startInventory.wheat  || 0,
			'flour' :  startInventory.flour  || 0,
			'tools' :  startInventory.tools  || 0
		};

		/**
		* @property {Number} firmNum
		* Used to keep track of and access firms
		* Each firm has a unique number
		*/
		this.firmNum = currentFirmNum++;

		/**
		* @property {Number} efficiency
		* Scales the firm's productive efficiency (number of goods produced)
		* A normally distributed number between 0 and 1
		*/
		this.efficiency = normal01();

		/**
		* @property {String} productionOrder
		* 'off': Avoids production, expansion, and trading
		* 'on': Firm partakes in production, expansion, and trading
		* 'auto': Firm automatically expands
		* Defaults to 'on' for players, 'auto' for CPUs
		*/
		this.productionOrder = 'auto';

		/**
		* @property {Number} upkeepInterval
		* When (what modulus) the firm pays upkeep
		*/
		this.upkeepInterval = random(1, UPKEEP_INTERVAL_SIZE);

		/**
		* @property {Number} ticks
		* How old the firm is in ticks
		* Used for calculations such as upkeep
		*/
		this.ticks = 0;

		/**
		* @property {Boolean} bankrupt
		* If the firm is bankrupt
		* Bankrupt firms perform no actions and are simply records of an old firm 
		* Firms go bankrupt if they cannot afford upkeep
		*/
		this.bankrupt = false;
		
		/**
		* @property {Number} prevAmountProduced
		* The amount of resources the firm produced the previous doProduction()
		* Used for adjusting prices
		*/
		this.prevAmountProduced = 0;
		
		/**
		* @property {Number} prevAmountSold
		* The amount of resources the firm sold the previous market tick
		* Used for adjusting prices
		* Modified by market.js
		*/
		this.prevAmountSold = 0;

		/**
		* @property {Number} forSale
		* How much of the produced good the firm is willing to sell
		* Used in getSellOrders() to determine amount to sell
		* Used in adjust()
		*/
		this.forSale = 0;

		/**
		* @property {Number} moneyToSave
		* How much money the firm refuses to spend
		* Used in getBuyOrders() to prevent the firm from buying too much
		* Some money is saved for expansion
		*/
		this.moneyToSave = 0;

		/**
		* @property {Number} timesExpanded
		* Keeps track of the number of times the firm has expanded
		* Currently for display only
		*/
		this.timesExpanded = 0;
	}

	/**
	* Runs once per tick
	* Handles basic firm logic such as upkeep, production, and expansion
	*/
	tick() {
		if(this.bankrupt) return;

		this.prevAmountSold = 0;
		this.ticks++;

		if(this.ticks % UPKEEP_INTERVAL_SIZE == this.upkeepInterval) {
			this.payUpkeep();
		}

		if(this.productionOrder == 'off') return;

		this.doProduction();

		if(this.hasAll(this.expandReady) && this.productionOrder == 'auto') {
			this.doExpansion();
		}

		// if the firm has all resources in expandReady except money
		// then it will save money for expansion
		// saving money is the last step
		if(this.hasAll(subtractAllFrom('money', this.expandReady) ) && this.productionOrder == 'auto') {
			this.moneyToSave = this.expandReady.money || 0;
		} else {
			this.moneyToSave = 0;
		}
	}

	/**
	* Pays for the firm's expansion, then performs the expansion
	*/
	doExpansion() {
		this.payAll(this.expandCost);
		this.addChildFirm();
		this.timesExpanded++;
	}

	/**
	* !! Overriden in main
	* Creates a new child firm, with the same type and sell price
	* Used by CPUs to reproduce
	*/
	addChildFirm() {
		return true;
	}

	/**
	* Attempts to pay upkeep, otherwise goes bankrupt
	*/
	payUpkeep() {
		if(this.hasUpkeep() ) {
			this.payAll(this.upkeepCost);
		}
		else {
			this.bankrupt = true;
			numBankrupt++;
		}
	}

	/**
	* Attempts to produce
	* Fails if the firm cannot afford its produceCost
	* Fails if the firm is trying to expand and cannot afford to both expand and produce
	* Otherwise succeeds
	* Paying produceCost and gaining producedGoods
	* Modified by variance, efficiency, and events such as current season
	* @return {Boolean} - true if production occurred, false if it failed
	*/
	doProduction() {
		if(!this.hasAll(this.produceCost) ) return false;

		// if it's trying to expand and cannot produce and maintain
		// the resources necessary for expansion, then skip production
		// applies to CPUs (which automatically expand)
		if(this.hasExpand() && this.productionOrder == 'auto')  {
			// checks that the firm has enough of
			// each resource in both expandReady and produceCost 
			// to produce and still be able to expand
			for(let resource in this.expandReady) {
				if(this.produceCost[resource] && 
					this.inventory[resource] < this.produceCost[resource] + this.expandReady[resource]) {
					return false;
				}
			}
		}

		// if above checks were passed, then the firm will produce

		this.payAll(this.produceCost);

		// produces all produces goods
		// taking into account the firm's variance, firm's efficiency, and current season modifier
		for(let resource in this.producedGoods) {
			let amountProduced = this.producedGoods[resource] + random(0, this.variance);
			amountProduced *= 0.95 + 0.1*this.efficiency;
			amountProduced *= getSeasonModifier(resource); // add current season's effect
			amountProduced = Math.round(amountProduced);

			this.gain(resource, amountProduced);
			this.prevAmountProduced = amountProduced;		
		}
		return true;
	}

	/**
	* Adjusts the firm's prices and amount for sale
	* Called in main.js after market tick is complete
	* Based off prevAmountProduced and prevAmountSold
	* @param {Boolean} saveAll - if true, sets the firm's forSale property to 0
	*/
	adjust(saveAll=false) {
		if(saveAll) {
			this.forSale = 0;
			return;
		}

		let sellResource = Object.keys(this.sell)[0];
		
		// ratio of amount sold to produced, larger if sold more
		// let factor = this.prevAmountSold / this.prevAmountProduced;
		// factor is half as effective, and at 1 remains constant, proportionally linear change in price
		// this.sell[sellResource] = Math.round(this.sell[sellResource] * (factor + 1)/2 );
		
		if(this.prevAmountProduced > this.prevAmountSold) {
			// produced more than sold, decrease price by 1
			this.sell[sellResource] -= 1;
		}
		else {
			// sold more than produced
			// increase price by 1 per how many times as much was sold vs produced (plus 1)
			let factor = this.prevAmountSold / this.prevAmountProduced;
			this.sell[sellResource] += Math.round(factor + 1);
		}

		// minimum sell price is 1
		this.sell[sellResource] = Math.max(1, this.sell[sellResource]);

		// save amount of sale good necessary for upkeep, if applicable
		this.forSale = this.inventory[sellResource] - (this.upkeepCost[sellResource] || 0);

		// if firm has its expand requirement
		if(this.hasExpand() ) {
			// it will save its expand resource
			if(this.expandReady[sellResource]) {
				this.forSale -= this.expandReady[sellResource];
			}
		}

		// forSale cannot be below 0
		this.forSale = Math.max(this.forSale, 0);
	}

	/**
	* Gives another firm an amount of a resource
	* @param {Object - Firm} firm - the firm to give the resources to
	* @param {String} resource - the name of the resource to give
	* @param {Number} amount - the amount of the resource to give
	* Used in market.js for completing orders
	*/
	give(firm, resource, amount) {
		firm.inventory[resource] += amount;
		this.inventory[resource] -= amount;
	}

	/**
	* Checks if the firm has the given amount of the given resource
	* @param {String} resource - the name of the resource to check
	* @param {Number} amount - the amount of the resource to check
	* @return {Boolean} - returns true if the firm has >= amount of resource
	*/
	has(resource, amount) {
		return this.inventory[resource] >= amount;
	}

	/**
	* Checks if the firm has a list of resources
	* @param {Object - Inventory} resources - the resources to check
	* @return {Boolean} - returns true if the firm has >= the amount of every resource given
	*/
	hasAll(resources) {
		for(let resource in resources) {
			if(this.inventory[resource] < resources[resource]) {
				return false;
			}
		}
		return true;
	}
	// unimplemented. can be used for checking if a firm is desirable for a resource
	// hasAny(resources) {
	// 	for(let resource in resources) {
	// 		if(this.inventory[resource] >= resources[resource]) {
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }
	
	/**
	* Checks if the firm has its expandRequirement
	* @return {Boolean} - true if it has expandRequirement, false otherwise
	*/
	hasExpand() {
		return this.hasAll(this.expandRequirement);
	}

	/**
	* Checks if the firm has its upkeepCost
	* @return {Boolean} - true if it has upkeepCost, false otherwise
	*/
	hasUpkeep() {
		return this.hasAll(this.upkeepCost);
	}

	/**
	* Removes the given amount of the given resource from the firm's inventory
	* @param {String} resource - resource to be removed
	* @param {Number} amount - amount of resource to be removed
	*/
	pay(resource, amount) {
		this.inventory[resource] -= amount;
	}

	/**
	* Removes the given amounts of all resources in the param from the firm's inventory
	* @param {Object - Inventory} resources - resources to be removed
	* Assumes they have enough resources. Should be checked with hasAll()
	*/
	payAll(resources) {
		for(let resource in resources) {
			this.inventory[resource] -= resources[resource];
		}
	}

	/**
	* Gives the firm the given amount of the given resource
	* @param {String} resource - resource to be gained
	* @param {Number} amount - amount of resource to be gained
	*/
	gain(resource, amount) {
		this.inventory[resource] += amount;
	}

	/**
	* Gives the firm the given amounts of all resources in the param
	* @param {Object - Inventory} resources - resources to be gained
	*/
	gainAll(resources) {
		for(let resource in resources) {
			this.inventory[resource] += resources[resource];
		}
	}

	/**
	* Returns the firm's type
	* @return {String} type - the type of firm, as defined in firms.js
	* Inherited from the classes that extend Firm
	* Used for counting firms, displaying firms, and expansion
	*/
	type() {
		return this.constructor.name.toLowerCase();
	}

	/**
	* Pretty print the firm
	* @return {String} str - the firm printed with type and number
	* Currently unimplemented
	*/
	// str() {
	// 	return this.type() + '#' + this.firmNum;
	// }

	/**
	* Receives the firm's sell orders for use in the market
	* @return {Object Array - Order Array} orders - the Orders the firm wishes to place
	* Currently, firms only sell one good, as they only produce one good
	* However, buy and sell order systems are in place to handle multiple goods
	* Players can sell multiple resources at once, which is why the function returns an array
	*/
	getSellOrders() {
		let sellResource = Object.keys(this.sell)[0];
		let sellPrice = this.sell[sellResource];
		let amount = this.forSale;
		return [new Order('sell', this.firmNum, sellResource, sellPrice, amount)];
	}

	/**
	* Receives the firm's buy orders for use in the market, given basic pricing data
	* @param {Object - PriceData} avgPrices - the average prices of each resource this market tick
	* @return {Object Array - Order Array} orders - the Orders the firm wishes to place
	* Returns [] if the firm has no money to spend or there is insufficient pricing data
	* 
	* @todo take into account the max amount of resources available
	* @todo take into account the resources the firm already has
	* @todo take into account if the firm would profit off of production
	* @todo take into account upkeep cost and expansion
	* 
	* Splits the money available into the resources it needs to produce
	* Weighed by the cost of the resources 
	* Calculated by amount of each resource necessary for production
	* Accounts for moneyToSave
	* Assumes that the firm's previous sellPrice is accurate of how much it will sell for
	* Currently only handles production of one good (how Firms are currently implemented)
	*/
	getBuyOrders(avgPrices) {
		let moneyAvailable = Math.max(this.inventory.money-this.moneyToSave, 0);
		if(moneyAvailable==0) return [];

		let sellResource = Object.keys(this.sell)[0];
		let sellPrice = this.sell[sellResource];
		let amountPerProduction = this.producedGoods[sellResource];		
		let moneyEarnedFromProduce = amountPerProduction * sellPrice;

		let costsPerProduce = {};
		let totalCostPerProduce = 0;
		for(let input in this.produceCost) {
			let inputProduceCost = this.produceCost[input];
			let inputAvgCost = avgPrices[input];
			if(inputAvgCost==-1 || inputAvgCost==0) return [];
			costsPerProduce[input] = inputProduceCost * inputAvgCost;
			totalCostPerProduce += costsPerProduce[input];
		}

		let orders = [];

		for(let input in this.produceCost) {
			// normalizedInputCost is [0,1] weight of
			// what percentage of the cost of producing should be from this input
			// accounts for the amount of input used and price of input, relative to sum
			let normalizedInputCost = costsPerProduce[input] / totalCostPerProduce;
			let buyPrice = Math.floor(normalizedInputCost * moneyEarnedFromProduce);
			let buyResource = input;

			let buyAmount = Math.floor(moneyAvailable * normalizedInputCost  / buyPrice);
			if(buyAmount == 0) continue;

			orders.push(new Order('buy', this.firmNum, buyResource, buyPrice, buyAmount) );
		}

		return orders;
	}
}