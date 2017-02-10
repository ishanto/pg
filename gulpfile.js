
const gulp = require('gulp'),
    gutil = require('gulp-util'),
//    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync');

var config ={
    host: 'localhost',
    port: 8080,
    otherPort: 3000,
    server: './server.js',

  jsRoot : ['*.js'],

	jsOthers: ['./js/lib/*.js'],

  jsSources: ['./js/hosonto/*.js'],

  jsServer: ['./js/hosonto/server/*.js'],

  jsControllers: ['./js/hosonto/controllers/*.js'],

    htmlSources: ['./*.html', './*.json', './views/*.html', './static/*.html'],
    cssSources: [
        './css/**/*.css',
    ],

    fontSources: [
        './fonts/**/*.*',
    ],

    tempDir: './temp',
    targetDir: './build/'

    };


function startBrowserSync() {
    if (browserSync.active) {
        return;
    }
    gulp.watch([config.htmlSources, config.jsSources, config.jsSources], ['build']);

    const options = {
        proxy: config.host + ':' + config.port,
        port: config.otherPort,
        files: [config.targetDir],
        injectChanges: true,
        reloadDelay: 1000,
    };
    browserSync(options);
}


gulp.task('default', ['serve']);

gulp.task('serve', ['build'], () => {
    const options = {
        script: config.server,
        delayTime: 1,
        env: {
            PORT: config.port,
            NODE_ENV: 'dev',
        },
        watch: [config.serverSource],
    };
    return nodemon(options)
        .on('restart', ['build'])
        .on('start', startBrowserSync);
});


gulp.task('log', function() {
    gutil.log('== Hosonto Demo ==')
});

gulp.task('copy', function() {
    gulp.src(config.htmlSources)
        .pipe(gulp.dest(config.targetDir));
    gulp.src(config.cssSources)
        .pipe(gulp.dest(config.targetDir+'/css'));
  gulp.src(config.fontSources)
      .pipe(gulp.dest(config.targetDir+'/fonts'));
	gulp.src(config.jsOthers)
        .pipe(gulp.dest(config.targetDir+'/js/lib'));
  gulp.src(config.jsRoot)
        .pipe(gulp.dest(config.targetDir));

});


//gulp.task('coffee', function() {
//    gulp.src(coffeeSources)
//        .pipe(coffee({bare: true})
//            .on('error', gutil.log))
//        .pipe(gulp.dest('scripts'))
//});

gulp.task('js', function() {
    gulp.src(config.jsSources)
        .pipe(uglify())
        //.pipe(concat('script.js'))
        .pipe(gulp.dest(config.targetDir+'/js/hosonto'));

        gulp.src(config.jsControllers)
            //.pipe(uglify())
            //.pipe(concat('script.js'))
            .pipe(gulp.dest(config.targetDir+'/js/hosonto/controllers'));

    gulp.src(config.jsServer)
            .pipe(uglify())
            // .pipe(concat('server.js'))
            .pipe(gulp.dest(config.targetDir+'/js/hosonto/server'));
        //.pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(config.jsSources, ['js']);
    gulp.watch(config.cssSources, ['css']);
    // gulp.watch(config.htmlSources, ['html']);
});

/*
gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true
    })
});
*/

/*
gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});
*/

gulp.task('build', ['copy', 'js',  'watch']);
