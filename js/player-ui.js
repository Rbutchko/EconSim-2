$( ()=> {
	fillPlayerInputTable();

	// drawPlayerUI(); // called in main
});

function drawPlayerUI() {
	let tmpHTML = '<div class="row">';
	for(firm of FIRMS)
		tmpHTML += '<div class="col-sm-4">' + capitalize(firm) + ': ' + getCountOfPlayerFirms(firm) + getSprite(firm, 'md') + '<br><br></div>';
	$('#player-firms').html(tmpHTML+'</div>');
	// $('#player-firms').append('TODO: click on firm and open it. display flavor, buy/sell buttons, graphs, on/off firm toggle');
	// $('#player-firms').append('<br>TODO: pie chart for types of firms');
	// $('#player-firms').append('<br>TODO: what the firm inputs and outputs');
	// $('#player-firms').append('<br>TODO: list of all firms of that type, view their inventory and manage them, buy/sell, etc');

	tmpHTML = '<div class="row">';
	for(item in player.inventory)
		tmpHTML += '<div class="col-sm-4">' + capitalize(item) + ': ' + player.inventory[item] + getSprite(item, 'md') + '<br><br></div>';
	$('#player-inventory').html(tmpHTML+'</div>');
	// $('#player-inventory').append('TODO: click on resource and open it. display flavor, price, graphs');
	// $('#player-inventory').append('<br>TODO: pie chart for types of resources');
	// $('#player-inventory').append('<br>TODO: what firms produce or require this resource');
}

function fillPlayerInputTable() {
	let tmpHTML = '<tr><td>Resource</td><td></td><td>Buy/Sell</td><td>Amount</td><td>Price</td></tr>';
	for(item in EMPTY_INVENTORY) {
		tmpHTML += '<tr>' +
			'<td>' + capitalize(item) + '</td>' +
			'<td><img src="img/icons/' + icons[item] + '.png" class="icon-sm"></td>' +
			'<td>' +
				'<div class="custom-control custom-switch">' +
					'<input type="checkbox" class="custom-control-input" id="' + item + '-switch">' +
					'<label class="custom-control-label" for="' + item + '-switch">Buy</label>' +
				'</div>' +
			'</td>' +
			'<td>' +
				'<input type="number" class="form-control" min="1" max="100" value="0">' +
			'</td>' +
			'<td>' +
				'<input type="number" class="form-control" min="1" max="100" value="10">' +
			'</td>' +
		'</tr>';
	}

	$('#trade-table').html(tmpHTML);
	// $('#trade-table').append('<br>TODO: add controls for transfering to reserve, display reserve (could be in new tab)');
}
