var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    uglifyjs = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    path = require('path');

global.rootDirectory = path.resolve(__dirname);
global.assets = {
    css: rootDirectory + '/src/scss/',
    js: rootDirectory + '/src/js/',
    jade: rootDirectory + '/src/templates/',
    output: {
        css: rootDirectory + '/public/src/css/',
        js: rootDirectory + '/public/src/js/',
        views: rootDirectory + '/public/views/',
    },
    maps: rootDirectory + '/public/src/maps/'
}



//node-sass
gulp.task('sass', (cb) => {
    var stream = gulp.src(__dirname + '/backend/tasks/sass.js');
    stream.on('end', () => {
        require(__dirname + '/backend/tasks/sass.js')()
    })

    return stream;
})



//node-jade
gulp.task('jade', function() {
    var stream = gulp.src(__dirname + '/backend/tasks/jade.js');
    stream.on('end', () => {
        require(__dirname + '/backend/tasks/jade.js')({
            pretty: true
        }, {})
    })
    return stream;
})

//node-js
gulp.task('js', function() {
    var stream = gulp.src(__dirname + '/backend/tasks/javascript.js');
    stream.on('end', () => {
        require(__dirname + '/backend/tasks/javascript.js')({
            pretty: true
        }, {})
    })
    return stream;
})










gulp.task('lint', () => {
    return gulp.src(['src/js/**/*.js', 'backend/bin/**/*.js'])
        .pipe(eslint({
            configFile: 'eslint.json'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('bundle', ['lint'], function() {
    var opts = {};
    return gulp.src(['src/js/main.js', 'src/js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('bundle.js'))
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(sourcemaps.write('../maps'))
        // .pipe(minify(opts))
        .pipe(gulp.dest('./public/src/js'));
})

gulp.task('min', function() {
    return gulp.src('./public/src/js/bundle.js')
        .pipe(uglifyjs().on('error', function(e) {
            console.log(e);
        }))
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('./public/src/js'));
})
















gulp.task('javascript', ['bundle', 'min'])





/* node server */
gulp.task('start', function() {
    nodemon({
        script: 'backend/server.js',
        ext: 'js',
        ignore: ["public/*", "src/*"],
        env: {
            'NODE_ENV': 'development'
        },
        tasks: []
    })
})









gulp.task('default', ['start'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass'])
    gulp.watch('src/templates/**/*.jade', ['jade'])
    gulp.watch('src/js/**/*.js', ['js'])
})
