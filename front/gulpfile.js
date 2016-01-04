var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('dev', function (){
    process.env.NODE_ENV = 'development';
});

gulp.task('prod', function (){
    process.env.NODE_ENV = 'production';
});

gulp.task('server', function () {
    options = {
        cwd: undefined
    };
    options.env = process.env;
    server.run(['bin/www'], options);

    gulp.watch(['app/**/*.html'], server.notify);
    gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);

    gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
        gulp.run('styles:css');
        server.notify(event);
    });

    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});

gulp.task('default', ['dev', 'server'], function () {
});