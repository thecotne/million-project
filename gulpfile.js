var gulp = require('gulp');
var named = require('vinyl-named');
var webpack = require('gulp-webpack');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');


gulp.task('js', function () {
	return gulp.src(['src/**/**.entry.js','spec/**/**.entry.js'])
		.pipe(named())
		.pipe(webpack({
			module: {
				noParse: [/bower_components/],
				loaders: [
					{
						test: /\.js$/,
						exclude: /node_modules|bower_components/,
						loader: 'babel-loader?stage=0'
					}
				]
			}
		}))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.entry', '.bundle');
		}))
		.pipe(gulp.dest('dist'))
		.pipe(uglify({
			compress: {
				sequences     : true,  // join consecutive statemets with the “comma operator”
				properties    : true,  // optimize property access: a["foo"] → a.foo
				dead_code     : true,  // discard unreachable code
				drop_debugger : true,  // discard “debugger” statements
				unsafe        : false, // some unsafe optimizations (see below)
				conditionals  : true,  // optimize if-s and conditional expressions
				comparisons   : true,  // optimize comparisons
				evaluate      : true,  // evaluate constant expressions
				booleans      : true,  // optimize boolean expressions
				loops         : true,  // optimize loops
				unused        : true,  // drop unused variables/functions
				hoist_funs    : true,  // hoist function declarations
				hoist_vars    : false, // hoist variable declarations
				if_return     : true,  // optimize if-s followed by return/continue
				join_vars     : true,  // join var declarations
				cascade       : true,  // try to cascade `right` into `left` in sequences
				side_effects  : true,  // drop side-effect-free statements
				warnings      : true,  // warn about potentially dangerous optimizations/code
				global_defs   : {}     // global definitions
			}
		}))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace('.bundle', '.ugly');
		}))
		.pipe(gulp.dest('dist'))
		;
});

gulp.task('default', ['js']);

gulp.task('watch', ['default'], function() {
	watch(['src/**/**.js', 'spec/**/**.js'], function() {
		gulp.start(['js']);
	});
});
