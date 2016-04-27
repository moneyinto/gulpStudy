var gulp        = require('gulp');
var browserSync = require('browser-sync');
var jade        = require('gulp-jade');
var less        = require('gulp-less');
var minifyCss   = require('gulp-minify-css');
var babel       = require('gulp-babel');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');

gulp.task('jade', function () {
    return gulp.src(['src/*.jade', 'src/view/*.jade', 'src/view/**/*.jade'], {
        base: 'src'
    })
        .pipe(jade())
        .pipe(gulp.dest('dist'))
});

gulp.task('less', function () {
    return gulp.src(['src/less/*.less', 'src/less/**/*.less'])
        .pipe(less())
        .pipe(minifyCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('js', function () {
    return gulp.src(['src/js/*.js', 'src/js/**/*.js'],{
            base: 'src'
        })
        .pipe(babel({
            presets: ['babel-preset-es2015']
        }))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist'))
});

gulp.task('serve', ['less', 'js', 'jade'], function () {
    browserSync({
        notify: false,
        files: ["dist/**/*", "dist/*"],         // 监听文件内容改变，刷新页面
        port: 3000,
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch('src/**/*', ['less', 'js', 'jade']);
});

gulp.task('default', ['serve'], function () {
    
});