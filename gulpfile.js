var gulp = require('gulp');
var less = require('gulp-less'); // preprocessor
var minifyCSS = require('gulp-csso'); // minify CSS
var jshint = require('gulp-jshint'); // fixer
var concat = require('gulp-concat'); // concatination
var browserSync = require('browser-sync').create(); //livereload
var uglify = require('gulp-uglify'); // minify js
var pump = require('pump'); // need for uglify 
var del = require('del'); // deleting folders/files
var babel = require('gulp-babel'); // transpile es6 code to es5
var gulpSequence = require('gulp-sequence');

//copy html
gulp.task('copy-html', function() {  
  gulp.src('dev/*.html')
    .pipe(gulp.dest('prod'));
});

//copy completed css by task 'less'
gulp.task('copy-css', function() {  
  gulp.src('dev/css/style.css')
    .pipe(gulp.dest('prod/css'));
});

//copy completed and minify js by task 'uglify'
gulp.task('copy-js', function() {  
  gulp.src('dev/min/js/*.js')
    .pipe(gulp.dest('prod/js'));
});



// add task less, concat
gulp.task('less', function () {
	return gulp.src('dev/less/*.less')
	.pipe(less())
	.pipe(concat('style.css'))
	.pipe(gulp.dest('dev/css'))
	.pipe(browserSync.stream())
});

//add task JShint
gulp.task('jshint', function() {
  return gulp.src('**.*')
    .pipe(jshint())
    .pipe(jshint.reporter(''))
});

//add task uglify
gulp.task('uglify', function (cb) {
  pump([
        gulp.src('dev/script/*.js'),
        uglify('app.js'),
        gulp.dest('dev/min/js')
    ],
    cb
  );
});

//transpile es6 into es5
gulp.task('js', function() {
    return gulp.src('dev/es6/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dev/script'));
});

//add task Livereload 
gulp.task('livereload', ['less'], function(){
	browserSync.init({
		server: './'
	})
	gulp.watch('dev/less/*.less', ['less'])
	gulp.watch('dev/*.html').on('change', browserSync.reload)
})

// add task del - delete folder 'prod'
gulp.task('del', function(){
	return del('prod')
})

gulp.task('prod', gulpSequence('del', 'less', 'js', 'uglify', 'copy-html', 'copy-css', 'copy-js'))



