/* the way checkifshouldBuyUpkeep works right now, a player can turn on his firm for one day and have to pay upkeep
or they can strategically turn thier firm off on that day and avoid upkeep- we can resolve this by resetting the upkeepInterval to the day 
the player turns on the firm- so you have to pay upkeep to reopen it, but then won't have to for two weeks */
checkShouldBuyUpkeep() { // sets a flag if this tick a firm shouldBuyUpkeep, so that it should try to buy it's upkeep costs
	// console.log('checking if this firm should buy upkeep');
	for(let i=0; i < TRADE_INTERVAL; i++) { 
		if( (this.ticks + i) % UPKEEP_INTERVAL_SIZE  == this.upkeepInterval) { 
			//the weird code about +1, +2 is checking that the next time this firm owes upkeep isn't before it has the chance to buy again
			this.shouldBuyUpkeep = true; 
		}
	}
}

doProduction() {
	//...
	checkShouldBuyUpkeep(this);
}

payUpkeep() {
	if(this.hasUpkeep() ) {
		this.payAll(this.upkeepCost);
		// this.shouldBuyUpkeep = false;
	}
	else {
		this.bankrupt = true;
		numBankrupt++;
	}
}

constructor() {
	// this.shouldBuyUpkeep = false; 		 // a flag that we set to true if they must pay upkeep
}