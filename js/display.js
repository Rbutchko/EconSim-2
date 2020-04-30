/**
* @author justingolden21
* imported by main
* 
* Defines the display function which updates the current display
* with relevant information from main to the page
* Updates firm list and economy information
*/

import { capitalize, formatBool, round } from './util.js';
import { getCurrentSeason } from './events.js';
import { AIs, numBankrupt } from './firm.js';
import { activity, ticks, prevActivity } from './main.js';
import { getSprite } from './sprites.js';
import { drawPlayerUI } from './player-ui.js';
import { drawChart, drawActivityChart } from './charts.js';

export function display(firms, doDrawChart=false) {
	let tmpHTML = '';

	let avgPrices = {};
	let firmsTryingToExpand = 0;

	for(let firm of firms) {
		if(!firm) continue;

		tmpHTML += '<div class="col-sm-6 col-md-4">'
		tmpHTML += 'Firm #' + firm.firmNum + ' &mdash; '
			+ getSprite(firm.type(), 'md') + capitalize(firm.type() ) + ':<br>';
		tmpHTML += 'Bankrupt: ' + formatBool(firm.bankrupt)
			+ '<hr><b>Inventory</b><br>';

		for(let item in firm.inventory) {
			tmpHTML += getSprite(item, 'xs') + capitalize(item) + ': ' + firm.inventory[item]
				+ getprogressBar(Math.min(firm.inventory[item]/10,200) );
		}

		let tryingToExpand = firm.hasExpand();
		if(tryingToExpand) firmsTryingToExpand++;

		tmpHTML += '<hr>Efficiency: ' + round(firm.efficiency)
			+ '<br>Trying to Expand: ' + formatBool(tryingToExpand)
			+ '<br>Times Expanded: ' + firm.timesExpanded
			+ '<hr>Sell Price: ' + Object.values(firm.sell)[0]
			+ '<br>For Sale: ' + firm.forSale
			+ '<br>Money To Save: ' + firm.moneyToSave
			+ '</div>';

		// ----------------

		let sellResource = Object.keys(firm.sell)[0];
		if(!avgPrices[sellResource]) {
			avgPrices[sellResource] = {
				count: 0,
				sum: 0
			};
		}
		avgPrices[sellResource].sum += firm.sell[sellResource];
		avgPrices[sellResource].count++;
	}

	$('#display').html(tmpHTML);

	tmpHTML = 'Prices: ';
	for(let resource in avgPrices) {
		if(resource == 'money') continue;
		avgPrices[resource].price = round(avgPrices[resource].sum / avgPrices[resource].count);
		tmpHTML += getSprite(resource) + capitalize(resource) + 
			' : ' + avgPrices[resource].price + ' | ';
	}
	$('.prices').html(tmpHTML);

	if(doDrawChart) {
		drawChart(avgPrices);
		drawActivityChart(activity);
	}

	$('.ticks').html(ticks);
	$('.firms').html(AIs.length - numBankrupt);
	$('.activity').html(activity +
		' <i class="fas fa-arrow-' + (activity > prevActivity ? 'up' : 'down') + '"></i>'
	);
	$('.expand').html(firmsTryingToExpand + ' / ' + (AIs.length - numBankrupt) );
	$('.season').html(getCurrentSeason(true) + ' ' + getSprite(getCurrentSeason() ) );

	tmpHTML = '';
	let totalInventory = {};
	let firmTypes = {};
	for(let firm in firms) {
		if(!firms[firm]) continue;
		
		let inv = firms[firm].inventory;
		for(let item in inv) {
			if(!totalInventory[item])
				totalInventory[item] = 0;
			totalInventory[item] += inv[item];
		}
		if(!firmTypes[firms[firm].type()])
			firmTypes[firms[firm].type()] = 0;
		firmTypes[firms[firm].type()]++;
	}
	let totalResources = 0;
	for(let item in totalInventory) {
		tmpHTML += getSprite(item) + capitalize(item) + ': ' + totalInventory[item] + ' | ';
		totalResources += totalInventory[item];
	}
	tmpHTML += 'Total: ' + totalResources;
	$('.total-resources').html(tmpHTML);

	tmpHTML = '';
	for(let type in firmTypes) {
		tmpHTML += getSprite(type) + capitalize(type) + ': ' + firmTypes[type] + ' | ';
	}
	$('.firm-types').html(tmpHTML);

	drawPlayerUI();
}

/**
* @param {Number} width - width of the progress bar in pixels
* @return {String} progressBar - An HTML string for a progress bar of given width
*/
const getprogressBar = (width)=>
	'<div class="progressbar" style="width:' + width + 'px;"></div>';