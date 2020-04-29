/**
* @author justingolden21
* imported by display, firm, and main
*/

/**
* Enum for seasons
* @enum {Number}
*/
const WINTER = 1;
const SPRING = 2;
const SUMMER= 3;
const FALL = 4;

let currentSeason = WINTER;

// measured in ticks
export const SEASON_LENGTH = 50;

/**
* Increment currentSeason
*/
export function nextSeason() {
	currentSeason++;
	if(currentSeason > 4) {
		currentSeason = 1;
	}
}

/**
* @param {Boolean} capitalized - If the returned string should be capitalized
* @return {String} season - The name of the current season
*/
export function getCurrentSeason(capitalized=false) {
	if(capitalized) {
		return ['Winter','Spring','Summer','Fall'][currentSeason-1];	
	}
	return ['winter','spring','summer','fall'][currentSeason-1];
}

/**
* @return {String} season - The name of the given season
*/
// export function getSeasonName(seasonNum) {
// 	return ['Winter','Spring','Summer','Fall'][seasonNum-1];
// }

/**
* @param {String} resource - The resource whos modifier should be returned
* @return {Number} modifier - The current season's modifier for the given resource
*/
export function getSeasonModifier(resource) {
	return SEASONS[currentSeason][resource];
}

// note: inventory numbers are multiplied against the produced good
const SEASONS = {
	[WINTER]: {
		'money' : 1.1,
		'bread' : 1,
		'ore'   : 1.1,
		'lumber': .9,
		'metal' : 1.2,
		'wheat' : .5,
		'flour' : 1,
		'tools' : 1
	},
	[SPRING]: {
		'money' : 1,
		'bread' : 1,
		'ore'   : 1,
		'lumber': 1.2,
		'metal' : 1,
		'wheat' : 1,
		'flour' : 1,
		'tools' : 1
	},
	[SUMMER]: {
		'money' : .9,
		'bread' : 1,
		'ore'   : .8,
		'lumber': 1.1,
		'metal' : 1,
		'wheat' : 2,
		'flour' : 1,
		'tools' : 1
	},
	[FALL]: {
		'money' : 1,
		'bread' : 1,
		'ore'   : 1.1,
		'lumber': 1,
		'metal' : 1.1,
		'wheat' : 1,
		'flour' : 1,
		'tools' : 1.1
	}
};

// @property {Number} frequency - The odds the event occurs relative to other events
// const YEAR_EVENTS = {
// 	'rename this': {
// 		'frequency': 0,

// 		'money' : 0,
// 		'bread' : 0,
// 		'ore'   : 0,
// 		'lumber': 0,
// 		'metal' : 0,
// 		'wheat' : 0,
// 		'flour' : 0,
// 		'tools' : 0
// 	},
// 	'rename this': {
// 		'frequency': 0,

// 		'money' : 0,
// 		'bread' : 0,
// 		'ore'   : 0,
// 		'lumber': 0,
// 		'metal' : 0,
// 		'wheat' : 0,
// 		'flour' : 0,
// 		'tools' : 0
// 	},
// 	'rename this': {
// 		'frequency': 0,

// 		'money' : 0,
// 		'bread' : 0,
// 		'ore'   : 0,
// 		'lumber': 0,
// 		'metal' : 0,
// 		'wheat' : 0,
// 		'flour' : 0,
// 		'tools' : 0
// 	}
// };

// @property {Number} length - The durration of the event in ticks
// const SHORT_EVENTS = {
// 	'rename this': {
// 		'frequency': 0,
// 		'length': 0,

// 		'money' : 0,
// 		'bread' : 0,
// 		'ore'   : 0,
// 		'lumber': 0,
// 		'metal' : 0,
// 		'wheat' : 0,
// 		'flour' : 0,
// 		'tools' : 0
// 	},
// 	'rename this': {
// 		'frequency': 0,
// 		'length': 0,

// 		'money' : 0,
// 		'bread' : 0,
// 		'ore'   : 0,
// 		'lumber': 0,
// 		'metal' : 0,
// 		'wheat' : 0,
// 		'flour' : 0,
// 		'tools' : 0
// 	},
// 	'rename this': {
// 		'frequency': 0,
// 		'length': 0,

// 		'money' : 0,
// 		'bread' : 0,
// 		'ore'   : 0,
// 		'lumber': 0,
// 		'metal' : 0,
// 		'wheat' : 0,
// 		'flour' : 0,
// 		'tools' : 0
// 	}
// };