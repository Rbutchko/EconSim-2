// note: currently unused. remove this comment when used
export function subtractResources(resources1, resources2) {
	let rtn = {};

	// input checking
	for(let resource in resources2) {
		if(!(resource in resources1) ) {
			console.error('Attempt to subtract resources that don\'t exist');
			console.error(resources1);
			console.error(resources2);
		}
	}

	for(let resource in resources1) {
		if(resource in resources2) {
			rtn[resource] = resources1[resource] - resources2[resource];
		}
		else {
			rtn[resource] = resources1[resource];
		}
	}
	return rtn;
}
