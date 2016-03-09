var fs = require('fs');
var separator = require('../index');

var original = fs.readFileSync('./fixtures/source.css', 'utf8');

var icons = separator.separate(original, {
	dataFile: true
});
var cleanUp = separator.separate(original, {
	dataFile: false
});
var print = separator.separate(original, {
	dataFile: true,
	pattern: {
		matchValue: false,
		matchAtRuleType: /print/
	}
});

var fontFace = separator.separate(original, {
	dataFile: true,
	pattern: {
		matchValue: false,
		matchAtRuleType: /font-face/
	}
});

fs.writeFileSync('./expected/data.css', icons.css);
fs.writeFileSync('./expected/styles.css', cleanUp.css);
fs.writeFileSync('./expected/print.css', print.css);
fs.writeFileSync('./expected/font-face.css', fontFace.css);
