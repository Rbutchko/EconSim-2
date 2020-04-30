/**
* @author justingolden21
* imported by main
* 
* Defines and controls player related functionality
* Player UI is controlled in player-ui.js
* Currently, functionality in several areas is still in early testing
*/

import { getFirmCount, EMPTY_INVENTORY, RESOURCE_TYPES } from './util.js';
import { AIs, currentFirmNum } from './firm.js';
import { Mine, Smith, Forester, Farm, Mill, Baker, Refinery, Mint } from './firms.js';
import { Order } from './orders.js';

// player object, which contains firms and inventory
export let player;

/**
* Unused, unfinished function
* For testing multiple player earned firms
*/
function addPlayerFirm(firmName='mine') {
	if(firmName=='mine')
		player.firms.push(new Mine(10) );
}

/**
* Setup the player with one test firm
* Currently, it's a smith with the default smith inventory
*/
export function setupPlayer() {
	player = {};
	player.firms = [];
	player.inventory = Object.assign({}, EMPTY_INVENTORY); // shallow clone

	player.firms[0] = new Smith(10); // default sell price of 10
	player.firms[0].inventory = player.inventory; // link to player inventory

	// give player default starting inventory for smith:
	// {'money': 3000, 'metal': 90, 'lumber': 60, 'bread': 40}
	// also demonstrates that shallow clone worked by not affecting EMPTY_INVENTORY
	player.inventory.money = 3000;
	player.inventory.metal = 90;
	player.inventory.lumber = 60;
	player.inventory.bread = 40;

	player.firms[0].productionOrder = 'on';

	// note: creating a new Firm() increments currentFirmNum
	// comment line below to test without player
	AIs[currentFirmNum-1] = player.firms[0];
	// below to test that the firmNums align (so that the player firm can be access by firmNum)
	// console.log(currentFirmNum-1, player.firms[0].firmNum);

	// test that shallow clone works:
	// player.inventory.money = 200;
	// console.log(EMPTY_INVENTORY.money, player.inventory.money);

	/**
	* Player firms should override the getBuyOrders and getSellOrders functions
	* within the Firm class
	* These functions will instead use the player's trading UI to obtain the desired orders
	* 
	* If the clear-trade-input-switch is checked, once an order for a resource is placed,
	* that resource's amount will be set to 0 for future orders
	*/
	player.firms[0].getBuyOrders = ()=> {
		let orders = [];
		for(let resource of RESOURCE_TYPES) {
			if(resource=='money') continue;
			let resourceAmount = $('#'+resource+'-amount-input').val();
			// if the switch is unchecked, the player is buying the resource
			if(!($('#'+resource+'-switch').is(':checked') ) && resourceAmount > 0) {
				let resourcePrice = $('#'+resource+'-price-input').val();
				let newOrder = new Order('buy', player.firms[0].firmNum, resource, resourcePrice, resourceAmount);
				newOrder.onComplete=( ()=> addOrderHistory(resource, resourcePrice, resourceAmount, 'buy') );
				// newOrder.onComplete=( ()=> addOrderHistory(newOrder) );
				orders.push(newOrder);
				if($('#clear-trade-input-switch').is(':checked') ) {
					$('#'+resource+'-amount-input').val(0);
				}
			}
		}
		return orders;
	}
	player.firms[0].getSellOrders = ()=> {
		let orders = [];
		for(let resource of RESOURCE_TYPES) {
			if(resource=='money') continue;
			let resourceAmount = $('#'+resource+'-amount-input').val();
			// if the switch is checked, the player is selling the resource
			if($('#'+resource+'-switch').is(':checked') && resourceAmount > 0) {
				let resourcePrice = $('#'+resource+'-price-input').val();
				let newOrder = new Order('sell', player.firms[0].firmNum, resource, resourcePrice, resourceAmount);
				newOrder.onComplete=( ()=> addOrderHistory(resource, resourcePrice, resourceAmount, 'sell') );
				orders.push(newOrder);
				if($('#clear-trade-input-switch').is(':checked') ) {
					$('#'+resource+'-amount-input').val(0);
				}
			}
		}
		return orders;
	}
}

// used in player-ui
export const getCountOfPlayerFirms = (type)=> getFirmCount(type, player.firms);

/**
* Appends HTML to the display of the player's order history
* Params align with Order params
* Note: does not take in an Order object because the amount will be 0 upon completion
*/
function addOrderHistory(resource, price, amount, type) {
	$('#order-history-display').prepend(
		`Completed ${type} order of ${amount} ${resource} at a price of ${price} per ${resource} for a total cost of ${amount*price}<br>`
	);
}