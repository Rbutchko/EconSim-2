/**
* @author justingolden21
* imported by display, player-ui
* 
* Holds sprite data for various icons
* Defines a wrapper function which provides the HTML for an icon
*/

// SGI_46
// SGI_177
/**
* @param {String} name - The name of the icon (a resource, firm, or season)
* @param {Number} size - The size of the icon. Img has a CSS class for sizes
* xs, sm, md, lg, xl
*/
export const getSprite = (name, size='sm') => 
	'<img class="icon-' + size + '" src="img/icons/' + icons[name] + '.png">';

const icons = {
	'money' : 'SGI_59',
	'bread' : 'SGI_164',
	'ore'   : 'SGI_65',
	'lumber': 'SGI_122',
	'metal' : 'SGI_84',
	'wheat' : 'SGI_62',
	'flour' : 'SGI_158',
	'tools' : 'SGI_24',

	'mine'	  : 'SGI_89',
	'smith'	  : 'SGI_70',
	'forester': 'SGI_110',
	'farm'	  : 'SGI_159',
	'mill'	  : 'SGI_49',
	'baker'	  : 'SGI_75',
	'refinery': 'SGI_121',
	'mint'	  : 'SGI_144',

	'winter':'SGI_170',
	'spring':'SGI_64',
	'summer':'SGI_134',
	'fall'  :'SGI_51'
};