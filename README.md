PostCSS Separator
============

Split up your Data-URI (or anything else) into a separate CSS file.

Written with [PostCSS](https://github.com/postcss).


## Installation

`$ npm install postcss-separator`

## Usage

Read `source.css`, process its content, and output processed CSS to `styles.css` and `data.css`.

``` js

var fs = require('fs');
var separator = require('postcss-separator');

var original = fs.readFileSync('source.css', 'utf8');

var icons = separator.packIt(original, {
	dataFile: true
});
var cleanUp = separator.packIt(original, {
	dataFile: false
});

fs.writeFile('data.css', icons.css);
fs.writeFile('styles.css', cleanUp.css);

```

If `source.css` has:

```css
a.top:hover, a.top:focus {
	background-image: url("data:image");
}

a.top {
	background-image: url("data:image");
}

caption, th, td {
	text-align: left;
	font-weight: normal;
	vertical-align: middle;
}

q, blockquote {
	quotes: none;
}

q:before, q:after, blockquote:before, blockquote:after {
	content: "";
}

a img {
	border: none;
}
```

You will get the following output:

```css
a.top:hover, a.top:focus {
	background-image: url("data:image");
}
a.top {
	background-image: url("data:image");
}
```

## Options

#### keepOrigin (only available in Grunt)
Type: `boolean`
Default value: false

Keep the origin file untouched when defined as `true`. When defined as `false` the origin css file will be cleaned up.

#### dataFile
Type: `boolean`
Default value: true

The generated css content of your file matches your pattern when defined as `true`. When defined as `false` the matching pattern will be removed from your css file. 

#### pattern.matchValue
Type: `RegExp`
Default value: /data:/

A string value that is used to set the value your are searching for in your css.

#### pattern.matchProp
Type: `RegExp`
Default value: false

A string value that is used to set the property your are searching for in your css.

#### pattern.matchRule
Type: `RegExp`
Default value: false

A string value that is used to set the rule your are searching for in your css.

#### pattern.matchMedia
Type: `RegExp`
Default value: false

A value that is used to set the media query your are searching for in your css.

#### pattern.matchParent
Type: `Boolean`
Default value: true

A boolean value that is used to include/exclude the rules parent node (eg. in @media blocks).


## Api

### packIt(css, [options])

Remove or separate into another file any data in your `css`.

The second argument is optional. The `options` is same as the second argument of
PostCSS's `process()` method. 

### postcss (WIP)

Returns PostCSS processor.

You can use this property for combining with other PostCSS processors.

```javascript
var autoprefixer = require('autoprefixer');
var separator = require('postcss-separator');
var postcss = require('postcss');

var css = fs.readFileSync('test.css', 'utf8');
postcss().use(
  autoprefixer.postcss
).use(
  separator.postcss
).process(css);
```

## Grunt Plugin

This package also installs a Grunt plugin. You can enable this plugin in the
`Gruntfile.js` of your project like that:

    grunt.loadNpmTasks('postcss-separator');

### Example Config

To separate all `dataURIs` from `src/css/styles.css` to `build/css/icons.css` and clean up the origin file, use the following configuration:

``` js
separator: {
	options: {
		keepOrigin: false, // overwrites source file
		dataFile: true // generate a new file with your pattern
	},
	icons: {
		options: {
			pattern: {
				matchValue: /data:/, // The RegExp to match values with
				matchParent: true // Rules (eg. in @media blocks) include their parent node.
			}
		},
		files: {
			'tmp/icons.css': ['source.css']
		}
	},
    image2x: {
        options: {
            pattern: {
                matchValue: false, // The RegExp to match values with
                matchRule: false, // The RegExp to match values with
                matchMedia: /((min|max)-)?resolution\:\s*(\d+)?\.?(\d+)?dppx/, // The RegExp to match media queries with
                matchParent: false // Rules (eg. in @media blocks) include their parent node.
            }
        },
        files: {
            'tmp/image.css': ['source.css']
        }
    }
}

```

For more examples see [Gruntfile.js](Gruntfile.js).

## License
Copyright (c) 2015 Sebastian Fitzner. Licensed under the MIT license.

## ToDos

- Add tests
- Add further plugin compatibility for postcss
