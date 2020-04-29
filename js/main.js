import { Mine, Smith, Forester, Farm, Mill, Baker, Refinery, Mint } from './firms.js';
import { Firm, AIs, currentFirmNum, numBankrupt, TRADE_INTERVAL } from './firm.js';
import { random, getFirmCount, FIRMS } from './util.js';
import { setupPlayer } from './player.js';
import { display } from './display.js';
import { manageTransacitons } from './market.js';
import { nextSeason, SEASON_LENGTH } from './events.js';

// setting stuff up: ticks, buttons, key listeners
window.onload = ()=> {
	start();
	// window.setInterval(tick, 100);
	// window.setInterval(tick, 500);
	window.setInterval(tick, 1000);
	$('#pause-btn').click( ()=> {
		paused = !paused;
		if(paused)
			$('#pause-btn').html('Resume <i class="fas fa-play"></i>');
		else
			$('#pause-btn').html('Pause <i class="fas fa-pause"></i>');
	});
	$('#tick-btn').click( ()=> {
		tick(true);
	});
	$('#top-btn').click( ()=> {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
	$('.buy-sell-switch').change( (evt)=> {
		let isChecked = $(evt.target).is(':checked');
		$(evt.target).parent().find('label').html(isChecked ? 'Sell' : 'Buy');
	})
}

// When the user scrolls down 100px from the top of the document, show the button
window.onscroll = function() {
	if(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		$('#top-btn').fadeIn();
	}
	else {
		$('#top-btn').fadeOut();
	}
};

let paused = false;
// let paused = true;
document.onkeydown = (evt)=> {
	evt = evt || window.event;
	if(evt.keyCode == 27) { // esc
		$('#pause-btn').click();
	}
	if(evt.keyCode == 84) { // t
		tick(true);
	}
};


// make all the firms :)
const startFirms = 100;
// const startFirms = 50;
function start() {
	for(let i=0; i<startFirms; i++) {
		newFirm();
	}

	setupPlayer();

	display(AIs, true);
}

// const MAX_FIRMS = 300;
// const MAX_FIRMS_PER_TYPE = 100;

const MAX_LIMITER = 10;
const LIMITER_TYPE = 'farm'

// needs to be overridden after all firm classes are defined
// so newFirm can be called
Firm.addChildFirm = ()=> newFirm(this.type(), this.sell[Object.keys(this.sell)[0] ]);

// can be called with firm type, if not random firm type
export function newFirm(firmType, sellPrice=10) {
	// if(currentFirmNum>=MAX_FIRMS) return false;

	if(!firmType)
		firmType = FIRMS[random(0,7)];

	if(getFirmCount(LIMITER_TYPE, AIs) >= MAX_LIMITER && firmType == LIMITER_TYPE) {
	// if(getFirmCount(firmType, AIs) >= MAX_FIRMS_PER_TYPE) {
		return false;
	}

	if(firmType == 'forester')
		AIs[currentFirmNum] = new Forester(sellPrice);
	else if(firmType == 'smith')
		AIs[currentFirmNum] = new Smith(sellPrice);
	else if(firmType == 'farm')
		AIs[currentFirmNum] = new Farm(sellPrice);
	else if(firmType == 'mine')
		AIs[currentFirmNum] = new Mine(sellPrice);
	else if(firmType == 'mint')
		AIs[currentFirmNum] = new Mint(sellPrice);
	else if(firmType == 'baker')
		AIs[currentFirmNum] = new Baker(sellPrice);
	else if(firmType == 'refinery')
		AIs[currentFirmNum] = new Refinery(sellPrice);
	else
		AIs[currentFirmNum] = new Mill(sellPrice);

	return true;
}

//  tick stuff

export let activity = 0;
export let prevActivity = 0;

export function addActivity(val) {
	activity += val;
}

export let ticks = 0;

function tick(overridePause=false) {
	if(paused && !overridePause) return;

	for(let i=0; i<AIs.length; i++) {
		if(AIs[i])
			AIs[i].tick();
	}

	for(let i=0; i<AIs.length; i++) {
		if(AIs[i] && AIs[i].bankrupt) {
			console.log('removed bankrupt AI of type', AIs[i].type() + ' making ', numBankrupt + ' bankrupt firms.');
			AIs[i] = undefined;
		}
	}

	if(ticks % TRADE_INTERVAL == 0) { //Can introduce sharding here by changing this to be a constant set in each firm, also change so firm inherits that as well as sell price
		prevActivity = activity;
		activity = 0;
		// doTrades(AIs.filter(AI => AI && !AI.bankrupt) );
		// doTrades(AIs.filter(AI => AI!=undefined) ); // add this back for stable version


		let sellOrders = [];
		let tradingFirms = AIs.filter(AI => AI != undefined && AI.productionOrder != 'off');
		for(let firm of tradingFirms) {
			let newOrders = firm.getSellOrders();
			for(let order of newOrders) {
				sellOrders.push(order);
			}
		}
		manageTransacitons(sellOrders, tradingFirms);


		for(let i=0; i<AIs.length; i++) {
			if(AIs[i])
				AIs[i].adjust();
		}
	}
	
	ticks++;
	//updates the current season
	if(ticks % SEASON_LENGTH == 0) {
		nextSeason();
	}
	display(AIs, ticks%TRADE_INTERVAL==0);
}
