##gulp study

>gulp是一个优秀的自动化构建的工具，它的核心在于流式的操作和简单易学上手的API，下面我们就来学习搭建一个简单的工程框架。

- 首先我们来简单建一下文件目录：
```
dist/
src/
    less/
    js/
    view/
gulpfile.js
package.json
```
***这里我们建一个gulpfile.js,我们所有的配置都写这里，注意的是它的名字只能是gulpfile.js。***
- 然后我们需要根据自己搭建框架的需要来引进一些插件，比如我想用jade，es6，less
```shell
npm install gulp gulp-jade gulp-babel gulp-preset-es2015 gulp-less --save-dev
```
我们安装gulp，这里推荐安装gulp为全局的，即
```shell
npm install gulp -g
```
下面我就来配置一下gulpfile.js：
```js
    //引入插件
    var gulp = require('gulp');
    var jade = require('gulp-jade');
    var babel = require('gulp-babel');
    var less = require('gulp-less');

    //gulp都是task任务，我们建一个任务为jade用来转换jade的代码
    gulp.task('jade', function(){
        //用return gulp.src()来创建一个虚拟文件对象流，然后匹配不同的文件,设置base灵活改变生成文件路径
        return gulp.src(['src/*.jade', 'src/view/*.jade', 'src/view/**/*.jade']，{
        	base: 'src'
        })
        	//转换jade的代码
            .pipe(jade())
            //gulp.dest()指定生成文件路径
            .pipe(gulp.dest('dist'))
    })

    //js任务
    gulp.task('js', function () {
    	return gulp.src(['src/js/*.js', 'src/js/**/*.js'],{
            base: 'src'
        })
        	.pipe(babel({
            	presets: ['babel-preset-es2015']
       		}))
        	.pipe(gulp.dest('dist'))
	});

    //less任务
    gulp.task('less', function () {
    	return gulp.src(['src/less/*.less', 'src/less/**/*.less'])
        	.pipe(less())
        	.pipe(gulp.dest('dist/css/'))
	});

    //gulp有一个default的任务
    gulp.task('default', ['jade'， 'js', 'less'], function () {

	});
```
***匹配模式***

\*：匹配单个文件或目录

\*.\*：能匹配带后缀的文件

\*/\*/\*.js：能匹配 a/b/c.js，但不能匹配a/b.js或a/b/c/d.js
\*\*能匹配所有的目录和文件
\*\*/\*.js 能匹配多级目录下的js文件（也包含当前目录下）
?.js能匹配单字符名的JS文件，如a.js
[xyz].js匹配x.js|y.js|z.js
[^xyz].js表示取反，不能匹配x.js|y.js|z.js文件
***如果需要对代码进行压缩混淆，重命名，我们可以用到一些gulp插件***
gulp-minify-css：压缩css代码
gulp-uglify：压缩混淆js
gulp-rename：重命名输出文件
- 我们可以转译代码了，这是我们需要给工程起一个server，然后监听文件的修改，即使编译刷新页面:
```shell
npm install browser-sync --save-dev
```
```js
gulp.task('serve', ['less', 'js', 'jade'], function () {
    browserSync({
        notify: false,
        files: ["dist/**/**/*", "dist/**/*", "dist/*"],         // 监听文件内容改变，刷新页面
        port: 3000,
        server: {
            baseDir: "./dist/"  //index页面
        }
    });
    gulp.watch('src/**/*', ['less', 'js', 'jade']);
});
```
***这时我们的工程初始模型就出来了，但是编译时如果出现错误，工程会挂掉，这是还要重启gulp serve，比较麻烦，处理方法是引入gulp-plumber***
#####我们的gulpfile.js就是这样了
```js
    var gulp        = require('gulp');
    var browserSync = require('browser-sync');
    var jade        = require('gulp-jade');
    var less        = require('gulp-less');
    var minifyCss   = require('gulp-minify-css');
    var babel       = require('gulp-babel');
    var uglify      = require('gulp-uglify');
    var rename      = require('gulp-rename');
    var plumber     = require('gulp-plumber');

    gulp.task('jade', function () {
        return gulp.src(['src/*.jade', 'src/view/*.jade', 'src/view/**/*.jade'], {
            base: 'src'
        })
            .pipe(plumber(function (error) {
                console.log('----------------------------------------');
                console.log(error);
                console.log('----------------------------------------');
            }))
            .pipe(jade())
            .pipe(plumber.stop())
            .pipe(gulp.dest('dist'))
    });

    gulp.task('less', function () {
        return gulp.src(['src/less/*.less', 'src/less/**/*.less'])
            .pipe(plumber(function (error) {
                console.log('----------------------------------------');
                console.log(error);
                console.log('----------------------------------------');
            }))
            .pipe(less())
            .pipe(minifyCss())
            .pipe(plumber.stop())
            .pipe(rename({ extname: '.min.css' }))
            .pipe(gulp.dest('dist/css/'))
    });

    gulp.task('js', function () {
        return gulp.src(['src/js/*.js', 'src/js/**/*.js'],{
                base: 'src'
            })
            .pipe(plumber(function (error) {
                console.log('----------------------------------------');
                console.log(error);
                console.log('----------------------------------------');
            }))
            .pipe(babel({
                presets: ['babel-preset-es2015']
            }))
            .pipe(uglify())
            .pipe(plumber.stop())
            .pipe(rename({ extname: '.min.js' }))
            .pipe(gulp.dest('dist'))
    });

    gulp.task('serve', ['less', 'js', 'jade'], function () {
        browserSync({
            notify: false,
            files: ["dist/**/**/*", "dist/**/*", "dist/*"],         // 监听文件内容改变，刷新页面
            port: 3000,
            server: {
                baseDir: "./dist/"
            }
        });
        gulp.watch('src/**/*', ['less', 'js', 'jade']);
    });

    gulp.task('default', ['serve'], function () {

    });
```

***在gulp之前会有一大串的插件引用，如果不想这样，可以通过gulp-load-plugins来解决这个问题***
参考[前端利器 Gulp 介绍](http://octman.com/blog/2015-2015-09-30-gulp-introduction/)

如果还需要其他的功能，可以根据实际情况再进行学习添加，配置。

