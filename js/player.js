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
	player.inventory = Object.assign({}, EMPTY_INVENTORY); // shallow clone

	player.firms[0] = new Smith();
	player.firms[0].inventory = player.inventory;
	player.firms[0].productionOrder = 'on';
	AIs.push(player.firms[0]);


	// test that shallow clone works:
	player.inventory.money = 200;
	// console.log(EMPTY_INVENTORY.money, player.inventory.money);
}

function getCountOfPlayerFirms(firmType) {
	let count = 0;
	for(playerFirm of player.firms) {
		if(playerFirm.type()==firmType) {
			count++;
		}
	}
	return count;
}