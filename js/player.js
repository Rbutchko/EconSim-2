const EMPTY_INVENTORY = {
	'money' : 0,
	'bread' : 0,
	'ore'   : 0,
	'lumber': 0,
	'metal' : 0,
	'wheat' : 0,
	'flour' : 0,
	'tools' : 0
};

const FIRMS = 'mine smith forester farm mill baker refinery mint'.split(' ');

let player;

function setupPlayer() {
	player = {};
	player.firms = [];
	player.firms[0] = new Smith();
	player.inventory = Object.assign({}, EMPTY_INVENTORY); // shallow clone

	// test that shallow clone works:
	player.inventory.money = 200;
	// console.log(EMPTY_INVENTORY.money, player.inventory.money);
}

function getCountOfPlayerFirms(firmType) {
	let count = 0;
	for(firm of player.firms) {
		if(firm.type()==firmType) {
			count++;
		}
	}
	return count;
}