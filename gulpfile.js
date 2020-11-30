var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new LessPluginCleanCSS({advanced: true});
var browserSync = require('browser-sync').create();

var paths = {
    less: 'src/less/style.less',
    js: 'src/js/**/*.js'
}
var dest = {
    css: 'dist/css/',
    js: 'dist/js/'
}

// plugins.min.css
var bowerCss = ['node_modules/@fortawesome/fontawesome-free/css/all.css',
                'node_modules/slick-carousel/slick/slick.css',
                'node_modules/bootstrap/dist/css/bootstrap.min.css',
                'node_modules/chart.js/dist/chart.min.css'
                ];

// plugins.min.js
var bowerJs = ['node_modules/jquery/dist/jquery.min.js',
               'node_modules/jquery-ui/jquery-ui.js',
               'node_modules/bootstrap/dist/js/bootstrap.min.js',
               'node_modules/@fortawesome/fontawesome-free/js/all.js',
               'node_modules/tinymce/tinymce.min.js',
               'node_modules/slick-carousel/slick/slick.js',
               'node_modules/jquery-validation/dist/jquery.validate.min.js',
               'node_modules/is-in-viewport/lib/isInViewport.min.js',
               'node_modules/chart.js/dist/chart.min.js'
               ];

 gulp.task('serve', ['less'], function() {

     browserSync.init({
       server: {
         baseDir: "./"
       }
     });
     gulp.watch("./*.html").on('change', browserSync.reload);

 });

gulp.task('less', function () {
    return gulp.src([ paths.less ])
        .pipe(plugins.less({
            plugins: [cleancss]
        }))
        .pipe(plugins.concat('main.min.css'))
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream());
});

gulp.task('css-plugins', function() {
    return gulp.src(bowerCss)
        .pipe(plugins.autoprefixer('last 15 version'))
        .pipe(plugins.cleanCss())
        .pipe(plugins.concat('plugins.min.css'))
        .pipe(gulp.dest(dest.css));
});

gulp.task('js-plugins', function() {
    return gulp.src(bowerJs)
        .pipe(plugins.concat('plugins.min.js'))
        .pipe(gulp.dest(dest.js));
});

gulp.task('js', function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(plugins.concat('main.min.js'))
        .pipe(gulp.dest(dest.js));
});

gulp.task('js-hint', function() {
    return gulp.src([paths.js])
        .pipe(plugins.plumber())
        .pipe(plugins.cached('jshint'))
        .pipe(plugins.jshint())
        .pipe(jshintNotify())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    gulp.watch(['src/less/**/*.less'], ['less']);
    gulp.watch(paths.js, ['js','js-hint']);
});

gulp.task('default', ['less', 'css-plugins', 'js-plugins', 'js', 'js-hint', 'watch']);
//uncomment line below if you want to serve
//gulp.task('default', ['less', 'css-plugins', 'js-plugins', 'js', 'js-hint', 'serve', 'watch']);

// utils
function plumber() {
    return plugins.plumber({errorHandler: plugins.notify.onError()});
}

function jshintNotify() {
    return plugins.notify(function(file) {
        if (file.jshint.success) {
            return false;
        }

        var errors = file.jshint.results.map(function (data) {
            return data.error ? '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason : '';
        }).join('\n');

        return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
    });
}
