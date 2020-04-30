/**
* @author rbutchko
* imported by main, player
* 
* Defines the 8 Firm classes which extend Firm
* Firm types differ only in their class property variables
* Such as starting inventory, and upkeep, production, and expansion information
* Functions are all inherited from the Firm class
*/

import {Firm} from './firm.js';

/**
* Note: Currently, none of the upkeep costs are things that they sell
* Note: expandReady must be > expandCost
* Note: Starting money and expandCost money should be equal (keeps amount of money constant)
*/

/**
* @class Mine
* Inputs: Bread, Tools
* Outputs: Ore
*/
export class Mine extends Firm {
	constructor(sellPrice) {
		super({'money':4000, 'bread':180, 'tools':80}); // starting inventory

		this.sell = {'ore': sellPrice}; // resource sold and its price

		this.upkeepCost = {'tools': 3};

		this.produceCost = {'bread': 30, 'tools': 10}; // resource cost to produce
		this.producedGoods = {'ore': 110}; // resources produced
		this.variance = 20; // amount production will vary from the value set in producedGoods

		// requirement before firm starts trying to accumulate resources necessary to expand
		this.expandRequirement = {'bread': 360, 'tools': 120};

		// resources necessary to expand
		this.expandReady = {'money': 8000, 'bread': 400, 'tools': 220, 'lumber': 70};

		// resources deducted from inventory upon expansion
		// note: this is less than expandReady so that firm doesn't go bankrupt upon expansion
		this.expandCost = {'money': 4000, 'bread': 220, 'tools': 90, 'lumber': 70};
	}
}

/**
* @class Smith
* Inputs: Metal, Lumber
* Outputs: Tools
*/
export class Smith extends Firm {
	constructor(sellPrice) {
		super({'money': 3000, 'metal': 90, 'lumber': 60, 'bread': 40});

		this.sell = {'tools': sellPrice};

		this.upkeepCost = {'bread': 10};

		this.produceCost = {'metal': 15, 'lumber': 10};
		this.producedGoods = {'tools': 20};
		this.variance = 10;

		this.expandRequirement = {'metal': 180, 'lumber': 120};
		this.expandReady = {'money': 6000, 'metal': 200, 'lumber': 140, 'bread': 160};
		this.expandCost = {'money': 3000, 'metal': 110, 'lumber': 80, 'bread': 60};
	}
}

/**
* @class Forester
* Inputs: Bread, Tools
* Outputs: Lumber
*/
export class Forester extends Firm {
	constructor(sellPrice) {
		super({'money': 3000, 'bread': 80, 'tools': 40});

		this.sell = {'lumber': sellPrice};

		this.upkeepCost = {'bread': 10, 'tools':1};

		this.produceCost = {'bread': 10, 'tools': 5};
		this.producedGoods = {'lumber': 30 };
		this.variance = 5;

		this.expandRequirement = {'bread': 160, 'tools': 80};
		this.expandReady = {'money': 6000, 'bread': 300, 'tools': 110};
		this.expandCost = {'money': 3000, 'bread': 100, 'tools': 50};
	}
}

/**
* @class Farm
* Inputs: Bread, Tools
* Outputs: Wheat
*/
export class Farm extends Firm {
	constructor(sellPrice) {
		super({'money': 2000, 'bread': 80, 'tools': 20});

		this.sell = {'wheat': sellPrice};

		this.upkeepCost = { 'bread': 5, 'tools':1};

		this.produceCost = {'bread': 10, 'tools': 2};
		this.producedGoods = {'wheat': 300};
		this.variance = 100;

		this.expandRequirement = {'bread': 110, 'tools': 40};
		this.expandReady = {'money': 4000, 'bread': 180, 'tools': 70, 'lumber': 30};
		this.expandCost = {'money': 2000, 'bread': 80, 'tools': 30, 'lumber': 30};
	}
}

/**
* @class Mill
* Inputs: Wheat, Bread
* Outputs: Flour
*/
export class Mill extends Firm {
	constructor(sellPrice) {
		super({'money': 3000, 'bread': 80, 'wheat': 1200, 'tools': 10});

		this.sell = {'flour': sellPrice};

		this.upkeepCost = {'bread': 5, 'tools':1};

		this.produceCost = {'wheat': 400, 'bread':10};
		this.producedGoods = {'flour': 300};
		this.variance = 50;

		this.expandRequirement = {'wheat': 2400, 'bread': 100};
		this.expandReady = {'money': 6000, 'bread': 200, 'wheat': 2400, 'tools': 50, 'lumber': 30};
		this.expandCost = {'money': 3000, 'wheat': 1200, 'bread': 120, 'tools': 15, 'lumber': 30};
	}
}

/**
* @class Baker
* Inputs: Flour, Lumber
* Outputs: Bread
*/
export class Baker extends Firm {
	constructor(sellPrice) {
		super({'money': 4000, 'bread': 20,'flour': 240, 'tools': 10, 'lumber': 30});

		this.sell = {'bread': sellPrice};

		this.upkeepCost = {'lumber': 1, 'tools':1};

		this.produceCost = {'flour': 40, 'lumber': 2};
		this.producedGoods = {'bread': 100};
		this.variance = 20;

		this.expandRequirement = {'flour': 480, 'lumber': 50};
		this.expandReady = {'money': 8000, 'flour':480, 'bread': 100, 'tools': 70, 'lumber': 100};
		this.expandCost = {'money': 4000, 'bread': 80, 'tools': 30, 'lumber': 50};
	}
}

/**
* @class Refinery
* Inputs: Bread, Ore
* Outputs: Metal
*/
export class Refinery extends Firm {
	constructor(sellPrice) {
		super({'money': 3000, 'bread': 60, 'tools': 5, 'ore': 240, 'tools': 10,'lumber': 10,});

		this.sell = {'metal': sellPrice};

		this.upkeepCost = {'lumber': 3, 'tools':1};
		
		this.produceCost = {'bread':10, 'ore': 50};
		this.producedGoods = {'metal': 30};
		this.variance = 5;

		this.expandRequirement = {'bread': 120, 'ore': 480};
		this.expandReady = {'money': 6000, 'bread': 140, 'ore': 480, 'tools': 50, 'lumber': 70};
		this.expandCost = {'money': 3000, 'bread': 80, 'ore': 240, 'tools': 30, 'lumber': 50};
	}
}

/**
* @class Mint
* Inputs: Bread, Metal
* Outputs: Money
*/
export class Mint extends Firm {
	constructor(sellPrice) {
		super({'money': 4000, 'bread': 120, 'tools': 10, 'metal': 120, 'lumber': 10,});

		// skipped by trading/order system, exists for normalcy
		this.sell = {'money': 1}; // sells 1 money for 1 money

		this.upkeepCost = {'lumber': 2, 'tools':1};

		this.produceCost = {'bread':20, 'metal': 20};
		this.producedGoods = {'money': 1250};
		this.variance = 100;

		this.expandRequirement = {'bread': 240, 'metal': 220};
		this.expandReady = {'money': 8000, 'bread': 260, 'tools': 35, 'metal': 220, 'lumber': 50};
		this.expandCost = {'money': 4000, 'bread': 140, 'tools': 20, 'metal': 120, 'lumber': 30};
	}
}
