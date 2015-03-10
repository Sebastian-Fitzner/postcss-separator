'use strict';

module.exports = function (grunt) {
	var pkg = require('../package.json');
	pkg.name = pkg.name.replace(/-/g, '_');

	grunt.registerMultiTask('separator', pkg.description, function () {
		var fs = require('fs-extra');
		var separator = require('../index');

		var options = this.options({
			keepOrigin: false,
			dataFile: true,
			pattern: {
				matchValue: /data/, // The RegExp to match values with
				matchProp: false, // The RegExp to match rules with
				matchRule: false, // The RegExp to match rules with
				matchMedia: false, // The RegExp to match media queries with
				matchParent: true // Rules (eg. in @media blocks) include their parent node.
			}
		});

		this.files.forEach(function (file) {
			var dest;
			var processed;
			var origin;
			var src;

			if (file.src.length !== 1) {
				grunt.fail.warn('This Grunt plugin does not support multiple source files.');
			}

			src = file.src[0];
			dest = file.dest;

			if (!fs.existsSync(src)) {
				grunt.log.warn('Source file "' + src + '" not found.');

				return;
			}

			processed = separator(options).packIt(fs.readFileSync(src, 'utf8'), options);
			fs.outputFileSync(dest, processed.css);
			grunt.log.writeln('File "' + dest + '" created.');

			if (!options.keepOrigin) {
				options.dataFile = false;

				origin = separator(options).packIt(fs.readFileSync(src, 'utf8'), options);
				fs.outputFileSync(src, origin.css);
				grunt.log.writeln('File "' + src + '" overwritten.');
			}
		});
	});
};
