/*
 * postcss-separator
 * https://github.com/Sebastian-Fitzner/postcss-separator
 *
 * Copyright (c) 2015 Sebastian Fitzner
 * Licensed under the MIT license.
 *
 */

'use strict';

var dataSeparator;
var postcss = require('postcss');
var helpers = require('./utils');

var DataSeparator = function (opts) {
	var options = {
		pattern: {
			matchValue: /data:/, // The RegExp to match values with
			matchProp: false, // The RegExp to match rules with
			matchRule: false, // The RegExp to match rules with
			matchMedia: false, // The RegExp to match media queries with
			matchParent: true // Rules (eg. in @media blocks) include their parent node.
		}
	};
	options = helpers.extend(options, opts);

	this.postcss = this.postcss.bind(null, options);
};

var matchParentMedia = function (parent, rule) {
	var parent = rule.parent.clone();

	if (parent.name === 'media') {
		parent.eachRule(function (childRule) {
			childRule.removeSelf();
		});
		parent.append(rule);
		return parent;
	} else {
		return rule;
	}
};

DataSeparator.prototype.postcss = function (opts, css) {
	var pattern = opts.pattern;
	var modCSS = postcss.root();

	if (pattern.matchValue || pattern.matchProp || pattern.matchRule || pattern.matchMedia) {
		if (pattern.matchMedia) {
			css.eachAtRule(function (atRule) {
				if (atRule.params.match(pattern.matchMedia)) {
					atRule.removeSelf();
					modCSS.append(atRule);
				}
			});
		}

		css.eachRule(function (rule) {
			var parent;

			if (pattern.matchValue) {
				rule.eachDecl(function (declaration) {
					if (declaration.value.match(pattern.matchValue)) {
						rule.removeSelf();

						if (pattern.matchParent) {
							modCSS.append(matchParentMedia(parent, rule));
						} else {
							modCSS.append(rule);
						}
					}
				});
			}

			if (pattern.matchProp) {
				rule.eachDecl(function (declaration) {

					if (declaration.prop.match(pattern.matchProp)) {
						rule.removeSelf();

						if (pattern.matchParent) {
							modCSS.append(matchParentMedia(parent, rule));
						} else {
							modCSS.append(rule);
						}
					}
				});
			}

			if (pattern.matchRule) {
				if (rule.selector.match(pattern.matchRule)) {
					rule.removeSelf();

					if (pattern.matchParent) {
						modCSS.append(matchParentMedia(parent, rule));
					} else {
						modCSS.append(rule);
					}
				}
			}

			if (pattern.matchMedia) {
				if (rule.selector.match(pattern.matchMedia)) {
					rule.removeSelf();

					if (pattern.matchParent) {
						modCSS.append(matchParentMedia(parent, rule));
					} else {
						modCSS.append(rule);
					}
				}
			}
		});

		if (opts.dataFile) {
			console.log('mod: ');
			return modCSS;
		} else {
			console.log('else: ');
			return css;
		}
	}
};

DataSeparator.prototype.separate = function (css, opts) {
	return postcss().use(this.postcss).process(css, opts);
};

dataSeparator = function (opts) {
	return new DataSeparator(opts);
};

dataSeparator.postcss = function (css) {
	return dataSeparator().postcss(css);
};

dataSeparator.separate = function (css, opts) {
	return dataSeparator(opts).separate(css, opts);
};

module.exports = dataSeparator;