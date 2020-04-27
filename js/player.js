const EMPTY_INVENTORY = {
	'money' : 0,
	'bread' : 0,
	'ore'   : 0,
	'lumber': 0,
	'metal' : 0,
	'wheat' : 0,
	'flour' : 0,
	'tools' : 0
};

const FIRMS = 'mine smith forester farm mill baker refinery mint'.split(' ');

let player;

// note: unfinished and unused. for testing only currently
function addPlayerFirm(firmName='mine') {
	if(firmName=='mine') {
		player.firms.push(new Mine(10) );
	}
}

function setupPlayer() {
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
	AIs.push(player.firms[0]); // comment this out if we want to test without player


	// test that shallow clone works:
	// player.inventory.money = 200;
	// console.log(EMPTY_INVENTORY.money, player.inventory.money);

	player.firms[0].getBuyOrders = ()=> {
		let orders = [];
		for(resource of RESOURCE_TYPES) {
			if(resource=='money') continue;
			let resourceAmount = $('#'+resource+'-amount-input').val();
			if(!($('#'+resource+'-switch').is(':checked') ) && resourceAmount > 0) { // if unchecked it's buying
				let resourcePrice = $('#'+resource+'-price-input').val();
				// console.log(resource, resourceAmount, resourcePrice);
				let newOrder = new Order('buy', player.firms[0].firmNum, resource, resourcePrice, resourceAmount);
				newOrder.onComplete( ()=> addOrderHistory(resource, resourcePrice, resourceAmount, 'buy') );
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
		for(resource of RESOURCE_TYPES) {
			if(resource=='money') continue;
			let resourceAmount = $('#'+resource+'-amount-input').val();
			if($('#'+resource+'-switch').is(':checked') && resourceAmount > 0) { // if checked it's selling
				let resourcePrice = $('#'+resource+'-price-input').val();
				// console.log(resource, resourceAmount, resourcePrice);
				let newOrder = new Order('sell', player.firms[0].firmNum, resource, resourcePrice, resourceAmount);
				newOrder.onComplete( ()=> addOrderHistory(resource, resourcePrice, resourceAmount, 'sell') );
				orders.push(newOrder);
				if($('#clear-trade-input-switch').is(':checked') ) {
					$('#'+resource+'-amount-input').val(0);
				}
			}
		}
		return orders;
	}
}

function getCountOfPlayerFirms(firmType) {
	let count = 0;
	for(playerFirm of player.firms) {
		if(playerFirm.type()==firmType) {
			count++;
		}
	}
	return count;
}

function addOrderHistory(resource, price, amount, type) {
	$('#order-history-display').prepend(
		'Completed ', type, ' order of ', amount, ' ', resource, ' at a price of ', price, ' per ', resource, ' for a total cost of ', amount*price, '<br>'
	);
}