const SEASON_LENGTH = 50; // ticks
const YEAR_LENGTH = SEASON_LENGTH*4;
const MAX_SHORT_EVENT_LENGTH = 600; //evntually will be more complicated than this, different lengths in different places

const WINTER = 1;
const SPRING = 2;
const SUMMER= 3;
const FALL = 4;

let currentSeason = WINTER;

//increments currentSeason variable
function changeSeason() {
	currentSeason++;
	if(currentSeason > 4) {
		currentSeason = 1;
	}
}

function getSeasonName(seasonNum) {
	return ['winter','spring','summer','fall'][seasonNum-1];
}

// inventory numbers are multiplied against the produced good
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

// frequency is odds event occurs relative to other events
const YEAR_EVENTS = {
	'rename this': {
		'frequency': 0,

		'money' : 0,
		'bread' : 0,
		'ore'   : 0,
		'lumber': 0,
		'metal' : 0,
		'wheat' : 0,
		'flour' : 0,
		'tools' : 0
	},
	'rename this': {
		'frequency': 0,

		'money' : 0,
		'bread' : 0,
		'ore'   : 0,
		'lumber': 0,
		'metal' : 0,
		'wheat' : 0,
		'flour' : 0,
		'tools' : 0
	},
	'rename this': {
		'frequency': 0,

		'money' : 0,
		'bread' : 0,
		'ore'   : 0,
		'lumber': 0,
		'metal' : 0,
		'wheat' : 0,
		'flour' : 0,
		'tools' : 0
	}
};

// length is durration of event, percentage of max short event length
const SHORT_EVENTS = {
	'rename this': {
		'frequency': 0,
		'length': 0,

		'money' : 0,
		'bread' : 0,
		'ore'   : 0,
		'lumber': 0,
		'metal' : 0,
		'wheat' : 0,
		'flour' : 0,
		'tools' : 0
	},
	'rename this': {
		'frequency': 0,
		'length': 0,

		'money' : 0,
		'bread' : 0,
		'ore'   : 0,
		'lumber': 0,
		'metal' : 0,
		'wheat' : 0,
		'flour' : 0,
		'tools' : 0
	},
	'rename this': {
		'frequency': 0,
		'length': 0,

		'money' : 0,
		'bread' : 0,
		'ore'   : 0,
		'lumber': 0,
		'metal' : 0,
		'wheat' : 0,
		'flour' : 0,
		'tools' : 0
	}
};