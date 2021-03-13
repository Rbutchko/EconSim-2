/**
* @author justingolden21
* imported by display, market
* 
* Defines the main game logic
* Contains logic for initialization, tick, adding a firm, and activity information
*/

import { random, getFirmCount, FIRMS } from './util.js';
import { nextSeason, SEASON_LENGTH } from './events.js';
import { Firm, AIs, currentFirmNum, numBankrupt, TRADE_INTERVAL } from './firm.js';
import { Mine, Smith, Forester, Farm, Mill, Baker, Refinery, Mint } from './firms.js';

import { paused } from './ui.js';
import { setupPlayer } from './player.js';
import { fillPlayerInputTable } from './player-ui.js';
import { display } from './display.js';
import { manageTransacitons } from './market.js';

/**
* Called on window load
* Creates all the firms, and sets up player
* Then displays information before first tick
*/
export function start() {

	// needs to be overridden after all firm classes are defined
	// so newFirm can be called
	Firm.addChildFirm = ()=> {
		// console.log('oh yeah');
		newFirm(this.type(), Object.values(this.sell)[0]);
	}
	Mine.addChildFirm = Firm.addChildFirm;
	Smith.addChildFirm = Firm.addChildFirm;
	Forester.addChildFirm = Firm.addChildFirm;
	Farm.addChildFirm = Firm.addChildFirm;
	Mill.addChildFirm = Firm.addChildFirm;
	Baker.addChildFirm = Firm.addChildFirm;
	Refinery.addChildFirm = Firm.addChildFirm;
	Mint.addChildFirm = Firm.addChildFirm;


	const startFirms = 100;
	// const startFirms = 50;

	for(let i=0; i<startFirms; i++) {
		newFirm();
	}

	setupPlayer();
	fillPlayerInputTable();

	display(AIs, true);
}


/**
* Returns a new firm of the given type
* @param {String} type - The type of the given firm, ie. 'Smith'
* @param {Number} sellPrice - The default sell price for the newly created firm
* @return {Object - Firm} - The newly created firm
*/
export function getNewFirmOfType(type, sellPrice) {
	switch(type) {
		case 'forester':
			return new Forester(sellPrice);
		case 'smith':
			return new Smith(sellPrice);
		case 'farm':
			return new Farm(sellPrice);
		case 'mine':
			return new Mine(sellPrice);
		case 'mint':
			return new Mint(sellPrice);
		case 'baker':
			return new Baker(sellPrice);
		case 'refinery':
			return new Refinery(sellPrice);
		case 'mill':
			return new Mill(sellPrice);
		default: {
			console.error(`Type ${type} does not exist`);
			return null;
		}
	}
}

/**
* Creates a new CPU firm of the given type
* @param {String} firmType - The firm type ('Smith', 'Baker', etc)
* If no type given, a random one will be selected
* @param {Number} sellPrice - The starting sell price for the firm
* Often inherited from its parent upon expansion
* @return {Boolean} success - True if firm was creates false otherwise
* @todo Weigh random firms unequally
*/
export function newFirm(firmType, sellPrice=10) {
	if(!firmType) firmType = FIRMS[random(0,7)];

	// const MAX_FIRMS = 300;
	// const MAX_FIRMS_PER_TYPE = 100;
	const MAX_LIMITER = 10;
	const LIMITER_TYPE = 'farm';

	// if(currentFirmNum>=MAX_FIRMS) return false;
	if(getFirmCount(firmType == LIMITER_TYPE && LIMITER_TYPE, AIs) >= MAX_LIMITER) {
	// if(getFirmCount(firmType, AIs) >= MAX_FIRMS_PER_TYPE) {
		return false;
	}

	AIs[currentFirmNum] = getNewFirmOfType(firmType, sellPrice);
	return true;
}

// amount sold per tick, used for display
export let activity = 0;
export let prevActivity = 0;
export function addActivity(val) {
	activity += val;
}

/**
* Perform one tick (unit of time)
* @param {Boolean} overridePause - If true, paused property will be ignored
* Used by tick button to run one tick, even with the game paused
* Ticks each firm, then removes bankrupt firms
* Performs trading if within its interval
* Then updates ticks, seasons, and display
*/
export let ticks = 0;
export function tick(overridePause=false) {
	if(paused && !overridePause) return;

	// tick each firm
	for(let i=0; i<AIs.length; i++) {
		if(AIs[i]) AIs[i].tick();
	}

	// remove bankrupt firms
	for(let i=0; i<AIs.length; i++) {
		if(AIs[i] && AIs[i].bankrupt) {
			console.log(`removed bankrupt AI of type ${AIs[i].type()}, making ${numBankrupt} bankrupt firms.`);
			AIs[i] = null;
		}
	}

	// perform trading
	if(ticks % TRADE_INTERVAL == 0) { 
		prevActivity = activity;
		activity = 0;

		// obtain sell orders
		let sellOrders = [];
		let tradingFirms = AIs.filter(AI => AI != null && AI.productionOrder != 'off');
		for(let firm of tradingFirms) {
			let newOrders = firm.getSellOrders();
			for(let order of newOrders) {
				sellOrders.push(order);
			}
		}
		// market tick
		manageTransacitons(sellOrders, tradingFirms);

		// adjust prices upon trade completion
		for(let i=0; i<AIs.length; i++) {
			if(AIs[i]) AIs[i].adjust();
		}
	}

	// update tick count and current season	
	ticks++;
	if(ticks % SEASON_LENGTH == 0) nextSeason();

	// display the new information
	// draw chart only if we traded
	display(AIs, ticks%TRADE_INTERVAL==0);
}
