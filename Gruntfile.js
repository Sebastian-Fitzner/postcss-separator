module.exports = function (grunt) {

	'use strict';

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		clean: {
			tests: ['tmp']
		},

		"separator": {
			options: {
				keepOrigin: true,
				dataFile: true
			},
			icons: {
				options: {
					pattern: {
						matchValue: /data/, // The RegExp to match values with
						matchParent: true // Rules (eg. in @media blocks) include their parent node.
					}
				},
				files: {
					'tmp/icons.css': ['test/fixtures/source.css']
				}
			},
			prop: {
				options: {
					pattern: {
						matchValue: false, // The RegExp to match values with
						matchProp: /background-image/, // The RegExp to match values with
						matchParent: true // Rules (eg. in @media blocks) include their parent node.
					}
				},
				files: {
					'tmp/prop.css': ['test/fixtures/source.css']
				}
			},
			ie: {
				options: {
					pattern: {
						matchRule: /lt-ie9/, // The RegExp to match values with
						matchMedia: false, // The RegExp to match media queries with
						matchParent: true // Rules (eg. in @media blocks) include their parent node.
					}
				},
				files: {
					'tmp/ie.css': ['test/fixtures/source.css']
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
					'tmp/image.css': ['test/fixtures/source.css']
				}
			}
		}
	});

	grunt.loadNpmTasks('postcss-separator');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('test', ['clean', 'separator']);
	grunt.registerTask('default', ['test']);

};