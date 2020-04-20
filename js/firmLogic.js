/* Trying to make firm logic*/ 

function productionStrat(firm) { // and the firm would also be an argument
	switch(firm.productionOrder) {
		case 'on':
			console.log('here a firm would act normally but not check to reproduce or do trading');
			firm.productionOrder = 'on';
			break;

		case 'off':
			// firm will do nothing and not pay upkeep
			console.log('firm would do nothing');
			firm.productionOrder = 'off';
			break;

		default: // why isn't this recognising null when I call it with that argument in the paramater
			firm.productionOrder = 'auto';
			console.log('This firm is an AI ' +  firm.productionOrder);
			// console.log('This firm is an AI, so it would follow all AI procedures. here we would call doProduction and trade and upkeep etc.');

		/* we could also semi-easily create a case where a firm does half its production for like .6 * the resources,
		or potentially produce more output for higher input costs (again loosing efficency). that would simulate a real life production curve*/
	}
}

/* the way checkifshouldBuyUpkeep works right now, a player can turn on his firm for one day and have to pay upkeep
or they can strategically turn thier firm off on that day and avoid upkeep- we can resolve this by resetting the upkeepInterval to the day 
the player turns on the firm- so you have to pay upkeep to reopen it, but then won't have to for two weeks */

function checkShouldBuyUpkeep(firm) { // sets a flag if this tick a firm shouldBuyUpkeep, so that it should try to buy it's upkeep costs
	console.log('checking if this firm should buy upkeep');
	let i = 0;
		for (; i < TRADE_INTERVAL; i++) { 
			if( (firm.ticks + i) % 14  == firm.upkeepInterval) { 
				//the weird code about +1, +2 is checking that the next time this firm owes upkeep isn't before it has the chance to buy again
				firm.shouldBuyUpkeep = true; 
			}
		}
}

function payUpkeep(firm) { // this code deducts upkeep costs and resets the shouldBuyUpkeep flag if the firm can pay, if it can't it sets bankrupt to true
	console.log('paying upkeep');
	if(firm.hasUpkeep() ) {
		firm.payAll(firm.upkeepCost);
		firm.shouldBuyUpkeep = false;
	}
	else {
		firm.bankrupt = true;
		numBankrupt++;
	}
}