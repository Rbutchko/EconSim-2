let inventory = {
	'money' : 0,
	'bread' : 0,
	'ore'   : 0,
	'lumber': 0,
	'metal' : 0,
	'wheat' : 0,
	'flour' : 0,
	'tools' : 0
};

const firms = 'mine smith forester farm mill baker refinery mint'.split(' ');

$( ()=> {
	fillPlayerInputTable();

	tmpHTML = '<div class="row">';
	for(idx in firms)
		tmpHTML += '<div class="col-sm-4">' + capitalize(firms[idx]) + ': ' + 0 + ' <img src="img/icons/' + icons[firms[idx] ] + '.png" class="icon-md"><br><br></div>';
	$('#player-firms').html(tmpHTML+'</div>');
	$('#player-firms').append('TODO: click on firm and open it. display flavor, buy/sell buttons, graphs, on/off firm toggle');
	$('#player-firms').append('TODO: pie chart for types of firms');

	tmpHTML = '<div class="row">';
	for(item in inventory)
		tmpHTML += '<div class="col-sm-4">' + capitalize(item) + ': ' + 0 + ' <img src="img/icons/' + icons[item] + '.png" class="icon-md"><br><br></div>';
	$('#player-inventory').html(tmpHTML+'</div>');
	$('#player-inventory').append('TODO: click on resource and open it. display flavor, price, graphs');
	$('#player-inventory').append('TODO: pie chart for types of resources');
});

function fillPlayerInputTable() {
	let tmpHTML = '<tr><td>Resource</td><td></td><td>Buy/Sell</td><td>Amount</td><td>Price</td></tr>';
	for(item in inventory) {
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
				'<input type="number" class="form-control" min="1" max="100" value="10">' +
			'</td>' +
			'<td>' +
				'<input type="number" class="form-control" min="1" max="100" value="10">' +
			'</td>' +
		'</tr>';
	}

	$('#trade-table').html(tmpHTML);
}
