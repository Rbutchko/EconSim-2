let player;

function setupPlayer() {
	player = {};
	player.firms = [];
	player.firms[0] = new Smith();
	player.inventory = Object.assign({}, EMPTY_INVENTORY); // shallow clone

	// test that shallow clone works:
	// player.inventory.money = 200;
	// console.log(EMPTY_INVENTORY.money, player.inventory.money);
}
