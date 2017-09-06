/**
 * 安装常用插件：
 * sass的编译                  （gulp-sass）
 * es6 => es5                 （gulp-babel）
 * 自动添加css前缀              （gulp-autoprefixer）
 * 压缩css                    （gulp-minify-css）
 * js代码校验                  （gulp-jshint）
 * 合并js文件                  （gulp-concat）
 * 压缩js代码                  （gulp-uglify）
 * 压缩图片                    （gulp-imagemin）
 * 自动刷新页面                 （gulp-livereload）
 * 图片缓存，只有图片替换了才压缩 （gulp-cache）
 * 修改名称                    （gulp-rename）
 * 更改提醒                    （gulp-notify）
 * 清除文件                    （del）
 * 安装这些插件需要运行如下命令：
 *
 * $ npm install gulp-sass gulp-less gulp-autoprefixer gulp-clean module-name gulp-minify-css jshint gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 * -save和-save-dev可以省掉你手动修改package.json文件的步骤。
 *
 * npm install module-name -save 自动把模块和版本号添加到dependencies部分
 * npm install module-name -save-dev 自动把模块和版本号添加到devdependencies部分
 * gulp命令
 * 你仅仅需要知道的5个gulp命令
 *
 * gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
 *
 * gulp.run(tasks...)：尽可能多的并行运行多个task
 *
 * gulp.watch(glob, fn)：当glob内容发生改变时，执行fn
 *
 * gulp.src(glob)：置需要处理的文件的路径，可以是多个文件以数组的形式，也可以是正则
 *
 * gulp.dest(path[, options])：设置生成文件的路径
 * glob：可以是一个直接的文件路径。他的含义是模式匹配。
 * gulp将要处理的文件通过管道（pipe()）API导向相关插件。通过插件执行文件的处理任务。
 *
 * gulp.task('default', function () {...});
 * gulp.task这个API用来创建任务，在命令行下可以输入$ gulp [default]，（中括号表示可选）来执行上面的任务。
 */
/* require all api：https://www.npmjs.com/package/{require_name}
 ---------------------------------------------------------------- */
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
/* scss ie8+
 ---------------------------------------------------------------- */
gulp.task('sass', function () {
    return gulp.src('src/css/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers:['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true,
            remove:true
        }))
        .pipe(rename({basename: '_'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({message: 'Scss task complete'}));
});

/* less ie8+
 ---------------------------------------------------------------- */
gulp.task('less', function () {
    return gulp.src('src/css/main.less')
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({basename: '_'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({message: 'Less task complete'}));
});
/* scripts
 ---------------------------------------------------------------- */
gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(rename({basename: '_'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({message: 'JS task complete'}));
});

/* images
 ---------------------------------------------------------------- */
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({message: 'Images task complete'}));
});

/* clean file
 ---------------------------------------------------------------- */
gulp.task('clean', function () {
    return gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
        .pipe(clean());
});

/* run default
 ---------------------------------------------------------------- */
gulp.task('default', ['clean'], function () {
    gulp.start('sass', 'js', 'images');
    //  gulp.start('less', 'js', 'images');
});

/* watch
 ---------------------------------------------------------------- */
gulp.task('watch', function () {

    gulp.watch('src/css/**/*.scss', ['sass']);

    gulp.watch('src/js/**/*.js', ['js']);

    gulp.watch('src/images/**/*', ['images']);

    // 建立即时重整伺服器
    const server = livereload();

    // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['dist/**']).on('change', function (file) {
        server.changed(file.path);
    });

});