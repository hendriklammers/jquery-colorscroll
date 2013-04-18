(function () {
	// Array with color steps
	var colors = [{
		color: '#a2e9ff',
		position: 500
	}, {
		color: '#9aff61',
		position: 1000
	}, {
		color: '#aaff9e',
		position: 4000
	}, {
		color: '#ffa378',
		position: 2000
	}, {
		color: '#92b3ff',
		position: 3000
	}];
	// Array array by position values
	colors.sort(dynamicSort('position'));

	var body = $('body'),
		currentColor;
	var pos1, pos2, color1, color2;

	// When user scrolls the color will be changed
	$(document).on('scroll', function (event) {
		var scrollAmount = $(this).scrollTop();

		if (scrollAmount < colors[0].position) {
			setColor(colors[0].color);
		} else if (scrollAmount > colors[colors.length - 1].position) {
			setColor(colors[colors.length - 1].color);
		} else {
			// Get the position
			for (var i = 0; i < colors.length; i++) {
				if (scrollAmount >= colors[i].position) {
					pos1 = colors[i].position;
					color1 = colors[i].color;
				} else {
					pos2 = colors[i].position;
					color2 = colors[i].color;
					break;
				}
			}
			// Calculate the relative amount scrolled
			var relativePos = ((scrollAmount - pos1) / (pos2 - pos1));
			// Calculate new color value
			var color = calculateColor(parseColor(color1), parseColor(color2), relativePos);
			setColor(color);
		}
	});
	// Trigger scroll to set initial color
	$(document).trigger('scroll');

	function setColor(newColor) {
		if (newColor != currentColor) {
			body.css('background-color', newColor);
			currentColor = newColor;
		}
	}

	function dynamicSort(property) {
		return function (a, b) {
			return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		};
	}

	// Calculate an in-between color. Returns "#aabbcc"-like string.


	function calculateColor(begin, end, pos) {
		var color = 'rgb' + ($.support['rgba'] ? 'a' : '') + '(' + parseInt((begin[0] + pos * (end[0] - begin[0])), 10) + ',' + parseInt((begin[1] + pos * (end[1] - begin[1])), 10) + ',' + parseInt((begin[2] + pos * (end[2] - begin[2])), 10);
		if ($.support['rgba']) {
			color += ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);
		}
		color += ')';
		return color;
	}

	// Parse an CSS-syntax color. Outputs an array [r, g, b]


	function parseColor(color) {
		var match, triplet;

		// Match #aabbcc
		if (match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color)) {
			triplet = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];

			// Match #abc
		} else if (match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color)) {
			triplet = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];

			// Match rgb(n, n, n)
		} else if (match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
			triplet = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];

		} else if (match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color)) {
			triplet = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseFloat(match[4])];

			// No browser returns rgb(n%, n%, n%), so little reason to support this format.
		}
		return triplet;
	}

})();