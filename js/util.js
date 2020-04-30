/**
* @author justingolden21
* imported by charts, display, firm, main, market, player-ui, and player
*
* Provides utility functions for use in other scripts
* Most functions are either mathematical, firm, resource, or string related
*/

/**
* Returns a random integer between min and max inclusive
*/
export function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/**
* Shuffles the given array in a random order
* @credit https://stackoverflow.com/a/6274381/4907950
*/ 
export function shuffle(a) {
	let j, x, i;
	for(let i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1) );
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

/**
* Returns a normally distributed (Gaussian) number, centered around 0
* @credit https://stackoverflow.com/a/36481059/4907950
*/
export function normal() {
	let u = 0, v = 0;
	while(u === 0) u = Math.random(); // converting [0,1) to (0,1)
	while(v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v);
}

/**
* Returns a normally distributed number between 0 and 1
* Normal value is compressed by a factor of 3, 
* then centered around 0.5 (as opposed to 0)
*/
export function normal01() {
	let tmp = 0.33*normal()+0.5;
	return tmp < 0 ? 0 : tmp > 1 ? 1 : tmp;
}

/**
* Returns the number of firms of the given type
*/
export function getFirmCount(type, firms) {
	return firms.reduce( (acc, item) => 
		acc + (item && item.type()==type ? 1 : 0), 0);
}

/**
* Subtracts all resources with the given name from the resources given
* @return {Object - Inventory} rtn - A copy of the resources given, with 0 of the named resource
* @param {String} resource - The name of the resource to be removed
* @param {Object - Inventory} resources - The original resources to be subtracted from
* 
* Note: cannot just do `resources[resource]=0`
* because resources is a pointer to an object and will therefore be mutated
* 
* if resource doesn't exist in resources, a copy of resources will be returned
*/
export function subtractAllFrom(resource, resources) {
	let rtn = Object.assign({}, resources); // shallow clone
	if(resources[resource])
		resources[resource] = 0;
	return rtn;
}

/**
* Rounds the given number to specified number of places
*/
export const round = (num, places=3) => Number( (num).toFixed(places) );

/**
* Capitalize the first letter of a word
*/
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
* Capitalize the first letter of each word
*/
export const capitalizeEach = (str)=> {
	let rtn = '';
	str = str.split(' ');
	for(let i=0; i<str.length; i++)
		rtn += capitalize(str[i]) + ' ';
	return rtn.slice(0,-1);
}

/**
* Format a boolean into the strings 'Yes' or 'No'
*/
export const formatBool = (bool)=> bool ? 'Yes' : 'No';

export const EMPTY_INVENTORY = {
	'money' : 0,
	'bread' : 0,
	'ore'   : 0,
	'lumber': 0,
	'metal' : 0,
	'wheat' : 0,
	'flour' : 0,
	'tools' : 0
};

export const FIRMS = 'mine smith forester farm mill baker refinery mint'.split(' ');

// note: omitting 'money'
export const RESOURCE_TYPES = [
	'bread',
	'ore',
	'lumber',
	'metal',
	'wheat',
	'flour',
	'tools'
];

export const RESOURCE_COLORS = [
	'#FFFA61',
	'#AB9E9B',
	'#55842C',
	'#E4DFBF',
	'#E08C1D',
	'#DBAC86',
	'#967752'
];
