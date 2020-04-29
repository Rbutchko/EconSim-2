import { capitalize, formatBool, round } from './util.js';
import { getSprite } from './sprites.js';
import { drawPlayerUI } from './player-ui.js';
import { getCurrentSeason } from './events.js';
import { drawChart, drawActivityChart } from './charts.js';
import { AIs, numBankrupt } from './firm.js';
import { activity, ticks, prevActivity } from './main.js';

export function display(firms, doDrawChart=false) {
	let tmpHTML = '';

	let avgPrices = {};
	let firmsTryingToExpand = 0;

	for(let firm in firms) {
		if(!firms[firm]) continue;

		tmpHTML += '<div class="col-sm-6 col-md-4">'
		tmpHTML += 'Firm #' + firms[firm].firmNum + ' &mdash; ' + getSprite(firms[firm].type(), 'md') + capitalize(firms[firm].type() ) + ':<br>';
		tmpHTML += 'Bankrupt: ' + formatBool(firms[firm].bankrupt) + '<hr><b>Inventory</b><br>';
		for(let item in firms[firm].inventory) {
			tmpHTML += getSprite(item, 'xs') + capitalize(item) + ': ' + firms[firm].inventory[item] + 
			'<div class="progressbar" style="width:' + Math.min(firms[firm].inventory[item]/10,200) + 'px;"></div>';
		}
		// tmpHTML += '<hr>Reserve:<br>';
		// for(item in firms[firm].reserve) {
		// 	tmpHTML += item + ': ' + firms[firm].reserve[item] + 
		// 	'<div class="progressbar" style="width:' + Math.min(firms[firm].reserve[item]/10,200) + 'px;"></div>';
		// }

		let tryingToExpand = firms[firm].hasExpand();
		if(tryingToExpand) {
			firmsTryingToExpand++;
		}
		tmpHTML += '<hr>Efficiency: ' + round(firms[firm].efficiency);
		tmpHTML += '<br>Trying to Expand: ' + formatBool(tryingToExpand);
		tmpHTML += '<br>Times Expanded: ' + firms[firm].timesExpanded;
		tmpHTML += '<hr>Sell Price: ' + firms[firm].sell[Object.keys(firms[firm].sell)[0] ];
		tmpHTML += '<br>For Sale: ' + firms[firm].forSale;
		tmpHTML += '<br>Money To Save: ' + firms[firm].moneyToSave;
		tmpHTML += '</div>';

		// ----------------

		let sellResource = Object.keys(firms[firm].sell)[0];
		if(!avgPrices[sellResource]) {
			avgPrices[sellResource] = {};
			avgPrices[sellResource].count = 0;
			avgPrices[sellResource].sum = 0;
		}
		avgPrices[sellResource].sum += firms[firm].sell[sellResource];
		avgPrices[sellResource].count++;
	}

	$('#display').html(tmpHTML);

	tmpHTML = 'Prices: ';
	for(let resource in avgPrices) {
		if(resource == 'money') continue;
		avgPrices[resource].price = round(avgPrices[resource].sum / avgPrices[resource].count);
		tmpHTML += getSprite(resource) + capitalize(resource) + ' : ' + avgPrices[resource].price + ' | ';
	}
	$('.prices').html(tmpHTML);
	if(doDrawChart) {
		drawChart(avgPrices);
		drawActivityChart(activity);
	}

	$('.ticks').html(ticks);
	$('.firms').html(AIs.length - numBankrupt);
	$('.activity').html(activity +
		' <i class="fas fa-arrow-' + (activity > prevActivity ? 'up' : 'down') + '"></i>');
	$('.expand').html(firmsTryingToExpand + ' / ' + (AIs.length - numBankrupt));
	$('.season').html(getCurrentSeason(true) + ' ' + getSprite(getCurrentSeason() ) );


	let totalInventory = {};
	let firmTypes = {};
	tmpHTML = '';
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