import { capitalize, RESOURCE_TYPES, RESOURCE_COLORS } from './util.js';

google.charts.load('current', {packages:['corechart','line']});
// google.charts.setOnLoadCallback(drawChart); // Do NOT do this, passes empty param and messes up variables

const PRICE_GRAPH_SIZE = 100;
let prevPrices = [];

// shift cuts from beginning, push pushes to end
// this function maintains the prevPrices object, which is graphed by drawChart
// this function is called by drawChart in the beginning
function addPrevPrices(newPrices) {
	if(prevPrices.length < PRICE_GRAPH_SIZE) {
		prevPrices.push(newPrices);
	}
	else {
		prevPrices.shift();
		prevPrices.push(newPrices);
	}
}

// note: when a resource isn't drawn, its color isn't skipped. meaning the next resource uses that color, and so on

export function drawChart(avgPrices) {
	addPrevPrices(avgPrices);

	let data = new google.visualization.DataTable();

	data.addColumn('number', 'Time');
	for(let resource of RESOURCE_TYPES) {
		if(! $('#'+resource+'-check').is(':checked') ) continue;
		data.addColumn('number', capitalize(resource) );
	}

	// data.addColumn('number', 'Guardians of the Galaxy');
	// data.addColumn('number', 'The Avengers');
	// data.addColumn('number', 'Transformers: Age of Extinction');

	// data.addRows([
	// 	[1, 37.8, 80.8, 41.8],
	// 	[2, 30.9, 69.5, 32.4],
	// 	[3, 25.4, 57, 25.7],
	// 	[4, 11.7, 18.8, 10.5],
	// 	[5, 11.9, 17.6, 10.4],
	// 	[6, 8.8, 13.6, 7.7],
	// 	[7, 7.6, 12.3, 9.6],
	// 	[8, 12.3, 29.2, 10.6],
	// 	[9, 16.9, 42.9, 14.8],
	// 	[10, 12.8, 30.9, 11.6],
	// 	[11, 5.3, 7.9, 4.7],
	// 	[12, 6.6, 8.4, 5.2],
	// 	[13, 4.8, 6.3, 3.6],
	// 	[14, 4.2, 6.2, 3.4]
	// ]);

	let rows = [];
	for(let i=0; i<prevPrices.length; i++) {
		let tmp = [i];
		for(let resource of RESOURCE_TYPES) {
			if(! $('#'+resource+'-check').is(':checked') ) continue;
			
			// bug: prevPrices[i][resource] is undefined if prevPrices doesn't have that resource (not enough firms)
			tmp.push(prevPrices[i][resource].price);
		}
		rows.push(tmp);
	}
	data.addRows(rows);

	let options = {
		title: 'Resource Prices',
		hAxis: {
			title: 'Time'
		},
		vAxis: {
			title: 'Price'
		},
		colors: RESOURCE_COLORS,
		backgroundColor: 'transparent',
		gridlineColor: '#333'
	};

	let chart = new google.visualization.LineChart(document.getElementById('linechart') );
	chart.draw(data, options);
}


// ----------------


const ACTIVITY_GRAPH_SIZE = 100;
let prevActivities = [];

function addPrevActivities(newActivity) {
	if(prevActivities.length < ACTIVITY_GRAPH_SIZE) {
		prevActivities.push(newActivity);
	}
	else {
		prevActivities.shift();
		prevActivities.push(newActivity);
	}
}

export function drawActivityChart(activity) {
	addPrevActivities(activity);

	let data = new google.visualization.DataTable();

	data.addColumn('number', 'Time');
	data.addColumn('number', 'Activity');

	let rows = [];
	for(let i=0; i<prevActivities.length; i++) {
		rows.push([i, prevActivities[i] ]);
	}
	data.addRows(rows);

	let options = {
		title: 'Activity vs. Time',
		hAxis: {
			title: 'Time'
		},
		vAxis: {
			title: 'Activity'
		},
		// colors: 'red',
		backgroundColor: 'transparent',
		gridlineColor: '#333'
	};

	let chart = new google.visualization.LineChart(document.getElementById('activity-linechart') );
	chart.draw(data, options);

}

// generate chart checkboxes
$( ()=> {
	let tmpHTML = '';
	for(let resource of RESOURCE_TYPES) {
		tmpHTML +=
			'<div class="custom-control custom-checkbox custom-control-inline">'
		+		'<div class="custom-control custom-checkbox">'
		+			'<input type="checkbox" class="custom-control-input" id="'+resource+'-check" checked>'
		+			'<label class="custom-control-label" for="'+resource+'-check">'+capitalize(resource)+'</label>'
		+		'</div>'
		+	'</div>';
	}
	$('#chart-checkbox-div').append(tmpHTML);
});
