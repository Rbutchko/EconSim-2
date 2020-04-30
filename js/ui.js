/**
* @author justingolden21
* imported by main
* 
* Defines the event listeners for window load, scroll, and keyboard
* Differs from display.js, which focuses more on displaying new information
* to the user every tick, while ui.js sets event listeners once
*/

import { start, tick } from './main.js';

export let paused = false;
// let paused = true;

/**
* Calls main's start function, then sets an interval for tick
* Sets the click listeners for pause, tick, and top buttons
* Sets the change listener for buy/sell switches to update their text
*/
window.onload = ()=> {
	start();
	// window.setInterval(tick, 100);
	// window.setInterval(tick, 500);
	window.setInterval(tick, 1000);

	$('#pause-btn').click( ()=> {
		paused = !paused;
		if(paused)
			$('#pause-btn').html('Resume <i class="fas fa-play"></i>');
		else
			$('#pause-btn').html('Pause <i class="fas fa-pause"></i>');
	});

	$('#tick-btn').click( ()=> tick(true) );

	$('#top-btn').click( ()=> {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});

	$('.buy-sell-switch').change( (evt)=> {
		let isChecked = $(evt.target).is(':checked');
		$(evt.target).parent().find('label').html(isChecked ? 'Sell' : 'Buy');
	});
}

/**
* When the user scrolls down 100px from the top of the document
* The "go to top" button is displayed, otherwise hidden
*/
window.onscroll = ()=> {
	if(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		$('#top-btn').fadeIn();
	}
	else {
		$('#top-btn').fadeOut();
	}
};

/**
* Esc key pauses
* "T" key ticks (overriding pause)
*/
document.onkeydown = (evt)=> {
	evt = evt || window.event;
	if(evt.keyCode == 27) { // esc
		$('#pause-btn').click();
	}
	if(evt.keyCode == 84) { // T
		tick(true);
	}
};