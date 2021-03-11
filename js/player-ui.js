/**
* @author justingolden21
* imported by display, main
* 
* Controls most operation regarding UI for the player object
* drawPlayerUI is called every time the display is updated
* fillPlayerInputTable is called upon page load in start() in main
*/

import { RESOURCE_TYPES, FIRMS, capitalize } from './util.js';
import { getSprite } from './sprites.js';
import { player, getCountOfPlayerFirms } from './player.js';

/**
* Draws the updated player UI with the player's current firms and inventory
* Called in display.js every UI update
* @todo: This would be made more efficient as only certain parts of the UI need updating
* and frequent updates to the DOM can be computationally expensive
*/
export function drawPlayerUI() {
	let tmpHTML = '<div class="row">';
	for(let firm of FIRMS) {
		tmpHTML += '<div class="col-sm-4">' + getSprite(firm, 'md') + ' ' + capitalize(firm) + ': ' 
			+ getCountOfPlayerFirms(firm) + '<br><br></div>';
	}
	$('#player-firms').html(tmpHTML+'</div>');
	// @todo: click on a firm to open it
	// and display its flavor, buttons to buy/sell the firm, graphs, and toggle the firm's productionOrder status
	// @todo: pie chart display for firm types
	// @todo: view what the firm inputs and outputs
	// @todo: toggle switches to sort firms by type

	tmpHTML = '<div class="row">';
	for(let item in player.inventory)
		tmpHTML += '<div class="col-sm-4">' + getSprite(item, 'md') + ' ' + capitalize(item) + ': ' + player.inventory[item] + '<br><br></div>';
	$('#player-inventory').html(tmpHTML+'</div>');
	// @todo: click on a resource to open it
	// and display its flavor, price information, and graphs
	// pie chart of types of resources
	// display which firms produce or require this resource
}

/**
* Draws the player's trade table UI dynamically, creating a table entry for each resource
* Called once the page is loaded
*/
export function fillPlayerInputTable() {
	let tmpHTML = '<tr><td>Resource</td><td></td><td>Buy/Sell</td><td>Amount</td><td>Price</td></tr>';
	for(let item of RESOURCE_TYPES) {
		// note: money is skipped (cannot buy or sell money)
		tmpHTML += '<tr>' +
			'<td>' + capitalize(item) + '</td>' +
			'<td>' + getSprite(item) + '</td>' +
			'<td>' +
				'<div class="custom-control custom-switch">' +
					'<input type="checkbox" class="custom-control-input buy-sell-switch" id="' + item + '-switch">' +
					'<label class="custom-control-label" for="' + item + '-switch">Buy</label>' +
				'</div>' +
			'</td>' +
			'<td>' +
				'<input id="' + item + '-amount-input" type="number" class="form-control" min="0" max="100" value="0">' +
			'</td>' +
			'<td>' +
				'<input id="' + item + '-price-input" type="number" class="form-control" min="1" max="100" value="10">' +
			'</td>' +
		'</tr>';
	}
	$('#trade-table').html(tmpHTML);
}