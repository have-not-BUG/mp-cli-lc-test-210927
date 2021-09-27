/* eslint-disable */
var gulp = require('gulp');
var plumber = require('gulp-plumber'); // 实时更新错误不会导致终端gulp运行开启的服务断开
var connect = require('gulp-connect'); // 在本地开启一个websocket服务，使用liveReload实现实时更新
var watch = require('gulp-watch'); // 监听文件的变化，配合connect实现服务自动刷新
var gulpOpen = require('gulp-open');//用指定软件打开文件
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var glob = require('glob');
var eventStream = require('event-stream');


var browserSync = require('browser-sync').create();
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

var autoprefixer = require('gulp-autoprefixer');
var fileinclude = require('gulp-file-include');
var ejs = require('gulp-ejs');

var os = require('os');
// var path = require('path');
var buffer=require('vinyl-buffer');
var babelify=require('babelify');
var gutil = require('gulp-util');
var fs = require('fs');

var ipv4IpLocal = function getLoaclIP() {
    var ipObj = os.networkInterfaces();
    var IPv4 = [];
    Object.keys(ipObj).forEach(function (ele) {
        ipObj[ele].forEach(function (ip) {
            if (ip.family === 'IPv4') {
                IPv4.push(ip.address);
            }
        });
    });
    return IPv4[0];
};



// 实现静态资源版本更新与缓存==================================================
var runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');
// assetRev = require('gulp-asset-rev');


//  压缩相关插件 ========================================
var cleanCSS = require('gulp-clean-css'),//css压缩
    uglify = require('gulp-uglify'),//js压缩
    concat = require("gulp-concat"), //合并文件
    htmlmin = require('gulp-htmlmin'),//html压缩
    // jshint=require("gulp-jshint"), //代码规范检查
    imagemin = require("gulp-imagemin"), //图片压缩
    rename = require("gulp-rename"),//重命名
    clean = require("gulp-clean");//清空文件夹


var babel = require("gulp-babel");
var sourcemaps = require('gulp-sourcemaps');
var file = require('gulp-file');
var inject = require('gulp-inject');

var workSpaceDir='./workspace';

var distDir='./workspace/dist';


// function getDateAndTime(dateObj) {
//     var nowDate = dateObj;
//     var y = (nowDate.getFullYear()).toString().slice(2,4);
//     var m = nowDate.getMonth() + 1;
//     m = m < 10 ?  ('0'+m) : m;
//     var d = nowDate.getDate();
//     d = d < 10 ? ('0'+d) : d;
//     var h = nowDate.getHours();
//     h = h < 10 ? ('0'+h) : h;
//     var min = nowDate.getMinutes();
//     min = min < 10 ? ('0'+min) : min;
//     var s = nowDate.getSeconds();
//     s = s < 10 ? ('0'+s) : s;
//     return  y+m+d+h+min+s
//     // return `${y}${m}${d}${h}${min}${s}`;
//
// }

// var curDateAndTime=getDateAndTime( new Date());


gulp.task('cssREM', function () {
    var processors = [px2rem({remUnit: 90.4})];
    var stream = gulp.src(workSpaceDir+'/css/*.css')
        .pipe(postcss(processors))
        .on('error', function (err) {
            console.error(' css rem处理出错了'+err)
        }).pipe(gulp.dest(workSpaceDir+'/css/rem'));
    console.log(' css rem在执行中 stream ' + stream)

    return stream;
});
gulp.task('fileinclude', function () {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['page/**/*.html', '!page/include/**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist0'));
});
gulp.task('ejs', function () {
    gulp.src('ejs/**.ejs')
        .pipe(ejs())
        .pipe(gulp.dest('dist_ejs'));
});








// gulp.task('html', function () {
//     return gulp.src("./workspace/*.html")
//         .pipe(htmlmin({collapseWhitespace: true}))
//         .pipe(gulp.dest("./dist/"));
// });
//
// gulp.task('cssjr', function () {
//     console.log('开始执行css兼容程序')
//     // https://www.gulpjs.com.cn/docs/api/#gulp.task
//     // cssjr 是css 任务的依赖 因此它要通知css它什么时候执行完了
//     // 有三种方式 通知它执行完了 1、回调 2、返回数据流stream  3、返回promise
//     var stream = gulp.src('./workspace/css/*.css')
//         .pipe(autoprefixer({
//             browsers: ['since 2010'],
//             cascade: false
//         }))
//         // .pipe(rename({
//         //     suffix: ".jr"
//         // }))
//         .pipe(gulp.dest('./dist/css/jianrong'));
//     console.log(' css兼容程序在执行中 stream ' + stream)
//     return stream;
//
//
// });
//
// gulp.task('css', ['cssjr'], function () {
//     // 执行该css任务的前提是 执行完了cssjr （cssjr 是css 的依赖）
//     //
//     console.log('开始执行css压缩')
//     return gulp.src("./dist/css/jianrong/*.css")
//         .pipe(cleanCSS({compatibility: 'ie8'}))
//         // .pipe(rename({
//         //     suffix: ".min."+curDateAndTime
//         // }))
//         .pipe(gulp.dest('./dist/css/'));
// });
//
//
// gulp.task('js', function (cb) {
//     console.log('开始压缩js');
//
//     pump([
//             gulp.src('./workspace/js/*.js'),
//             uglify(),
//             // rename({suffix: '.min.'+curDateAndTime}),
//             gulp.dest('./dist/js')
//         ],
//         cb
//     );
// });
//
// gulp.task('img', function () {
//     console.log('开始压缩图片');
//     return gulp.src('./workspace/img/**/*')
//             .pipe(imagemin())
//             .pipe(gulp.dest('./dist/img'))
//     }
// );
//
//
// gulp.task("clean", function(){
//     console.log('开始清空dist文件夹 --不清空img ');
//     return gulp.src(['./dist/*.html','./dist/css/*','./dist/js/*.js'])
//         .pipe(clean());
// });
//
// gulp.task("cleanIncludeImg", function(){
//     console.log('开始清空dist文件夹 --清空img');
//     return gulp.src(['./dist/*.html','./dist/css/*','./dist/js/*.js','./dist/img/*'])
//         .pipe(clean());
// });
//
//
// // 压缩（不压缩图片）但不清空
// gulp.task('jrmin', ['html', 'css', 'js']);
//
// // 清空并压缩 （不含图片）
// gulp.task('cleanAndMin', ['clean'],function(){
//     gulp.start('html', 'css', 'js')
// });
//
//
// // 清空并压缩 （含图片）
// gulp.task('min', ['cleanIncludeImg'],function(){
//     gulp.start('html', 'css', 'js','img')
// });






// //定义css、js源文件路径
// var cssSrc = './dist/css/*.css',  //dist下的所有css文件
//     jsSrc = './dist/js/*.js';  //dist下的所有js文件
//
//
// //为css中引入的图片/字体等添加hash编码
// // gulp.task('assetRev', function(){
// //     return gulp.src(cssSrc)   //该任务针对的文件
// //         .pipe(assetRev())  //该任务调用的模块
// //         .pipe(gulp.dest('src/css')); //编译后的路径
// // });
//
// //CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
// gulp.task('revCss', function(){
//     console.log('revCss执行了')
//     return gulp.src(cssSrc)
//         .pipe(rev())
//         .pipe(gulp.dest('revDist/css'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('revDist/css'));
//
// });
//
// //js生成文件hash编码并生成 rev-manifest.json文件名对照映射
// gulp.task('revJs', function(){
//     return gulp.src(jsSrc)
//         .pipe(rev())
//         .pipe(gulp.dest('revDist/js'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('revDist/js'));
// });
//
// //Html替换css、js文件版本
// gulp.task('revHtml', function () {
//     return gulp.src(['revDist/**/*.json', 'dist/*.html'])
//         .pipe(revCollector())
//         .pipe(gulp.dest('revDist'));
// });
//
// //开发构建  代码压缩后 加hash  注意img文件夹和js/notchange 文件夹中的文件均不会进行更新!!!
// gulp.task('cacheCtr', function (done) {
//     condition = false;
//     runSequence(
//         // ['assetRev'],
//         ['revCss'],
//         ['revJs'],
//         ['revHtml'],
//         done);
// });


// gulp gulp1 执行前应该先执行 default
// gulp.task('gulp1', ['cacheCtr']);


// // E6语法转换相关代码
//
// var babel = require("gulp-babel");
// var sourcemaps = require('gulp-sourcemaps');
//
// gulp.task('babelTest', function () {
//     // 1、插入polyfill文件到html并测试 2、 实现类似于 browser-sync 功能 todo
//     // var polyfill = './node_modules/babel-polyfill/dist/polyfill.js';
//     // return gulp.src([polyfill,'es6/*.js'])
//     //     .pipe(sourcemaps.init())
//     return gulp.src('es6/*.js')
//            .pipe(sourcemaps.init())
//         // .pipe(babel({presets: ['es2015']}))
//         // .pipe(concat('all.min.js'))
//         // .pipe(babel())
//         .on('error', function (err) {
//            console.error('sourcemaps相关程序出错了'+err)
//         })
//         // .pipe(babel())
//         .pipe(babel({
//             presets: ['@babel/env']
//             // ,plugins: ['@babel/transform-runtime'] // 如果启用这个 则会在js中 采用require语法引用的方式 因此不适合
//             // 另外 babel-runtime 可以部分取代babel-polyfill功能 但是像 [1,2,3].includes(1)实例方法 则不可替代
//         }))
//         .on('error', function (err) {
//            console.error('babel({\n' +
//                '            presets: [\'@babel/env\']\n' +
//                '        })出错了'+err)
//         })
//         .pipe(sourcemaps.write('.'))
//         // .pipe(uglify())
//         .pipe(gulp.dest('es6/dist/'))
//         .on('error', function (err) {
//             console.error('babelTest出错了'+err)
//         })
// });


// 一、gulp 启动服务并监测资源变化并自动刷新

// （一）、方法一：不使用browserSync的方法 缺点 不能启用两个
// var workSpaceDir='./es6';
// gulp.task('connectAllFile', function(){
//     gulp.src(workSpaceDir+'/**/*')
//         .pipe(plumber({
//             errorHandler: function(error) {
//                 this.error('end');
//                 console.error('监听所有文件出错了'+error)
//             }
//         }))
//         // .pipe(gulp.dest('dist/js'))
//         .pipe(connect.reload())
//     console.log('connectAllFile')
//
// })
// // gulp.task('ant_html', function(){
// //     gulp.src('index.html')
// //         .pipe(rev())
// //         .pipe(gulp.dest('dist/html'))
// //         .pipe(connect.reload())
// // })
// //选取谷歌浏览器
// var browser = os.platform() === 'linux' ? 'google-chrome' : (
//     os.platform() === 'darwin' ? 'google chrome' : (
//         os.platform() === 'win32' ? 'chrome' : 'firefox'));
//
// gulp.task('startServerAndOpenBrower', function() {
//     connect.server({
//         livereload: true,
//         port: 8888,
//         host:ipv4IpLocal()
//     })
//     gulp.src(__filename)
//         .pipe(gulpOpen({
//             uri: ipv4IpLocal()+':8888/'+workSpaceDir.slice(2),
//             app: browser
//         }));
//     console.log('startServerAndOpenBrower执行了')
// })
// gulp.task('watchAllFile', function() {
//     gulp.watch(workSpaceDir+'/**/*', ['connectAllFile'])
//     // gulp.watch('src/js/*.js', ['js'])
//     console.log('watchAllFile执行了')
//
// })
//
// gulp.task('default', [ 'connectAllFile', 'watchAllFile', 'startServerAndOpenBrower'])

// （二）、方法二：使用browserSync的方式

gulp.task('default', function() {
    browserSync.init({
        server: {
            baseDir: workSpaceDir
        },
        open:'external',
        files:[workSpaceDir+'/*.html',workSpaceDir+'/css/*.css',workSpaceDir+'/js/*.js'],
        ghostMode: false // 禁止 点击，滚动和表单在任何设备上输入将被镜像到所有设备里
    });
});



// 二、js相关

// 1、现用方案

// gulp.task('sc', function() {
//     return gulp.src('./workspace/js/*.js')
//         .pipe(sourcemaps.init({loadMaps: true}))
//         .on('error', function (err) {
//             console.error('sourcemaps相关程序出错了'+err)
//         })
//         .pipe(babel({
//             // presets: ['@babel/env'],
//             // plugins: ['@babel/transform-runtime'], // 如果启用这个 则会在js中 采用require语法引用的方式 因此不适合
//             presets: [['@babel/preset-env',{
//                 "useBuiltIns": "usage",
//                 "corejs": 3,
//                 "debug": true
//             }]],
//             plugins: [['@babel/plugin-transform-runtime',{
//                 "corejs": {
//                     "version": 3,
//                     "proposals": true
//                 },
//                 "regenerator": true
//             }]],
//             "ignore": [
//                 "node_modules"
//             ]
//             // 如果启用这个 则会在js中 采用require语法引用的方式 因此不适合
//             // 另外 babel-runtime 可以部分取代babel-polyfill功能 但是像 [1,2,3].includes(1)实例方法 则不可替代
//         }))
//         .on('error', function (err) {
//             console.error('babel({\n' +
//                 '            presets: [\'@babel/env\']\n' +
//                 '        })出错了'+err)
//         })
//         // .pipe(uglify())
//         // .on('error', function (err) {
//         //     console.error(' js 压缩混淆出错了 pipe(uglify())'+err)
//         // })
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest('./workspace/sourceDist/'));
// });
//
// gulp.task('all', ['sc'],function (done) {
//     // condition = false;
//         runSequence(
//             // ['assetRev'],
//             ['browserifyTest'],
//             done);
// });
//
// gulp.task('browserifyTest', function(done) {
//     glob('./workspace/sourceDist/**.js', function(err, files) {
//         console.log('files',files)
//         console.log('browserifyTest出错了:err ',err)
//         if(err) done(err);
//         var tasks = files.map(function(entry) {
//             return browserify({ entries: [entry] })
//                 .bundle()
//                 .pipe(source(entry))
//                 // .pipe(rename({
//                 //     extname: '.bundle.js'
//                 // }))
//                 .pipe(gulp.dest('.'));
//         });
//         eventStream.merge(tasks).on('end', done);
//     })
// });


// gulp.task('ba', function(){
//     var   oneFile  = './workspace/js/index.js';
//     return browserify(oneFile,{debug:true}).transform(babelify,
//         {
//             presets: [["@babel/preset-env",{
//                 "useBuiltIns": "usage",
//                 "corejs": 3,
//                 "debug": true
//             }], "@babel/preset-react"],
//             // plugins: [['@babel/plugin-transform-runtime',{
//             //     "corejs": {
//             //         "version": 3,
//             //         "proposals": true
//             //     },
//             //     "regenerator": true
//             // }]],
//             "ignore": [
//                 "node_modules"
//             ],
//             sourceMaps:true
//         })
//         .bundle()
//         .pipe(source('index.js'))
//         .pipe(buffer())
//         .pipe(sourcemaps.init({loadMaps: true}))
//         .pipe(uglify())
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest('./workspace/js/babelify'))
//         .pipe(gutil.noop())
// })

// 1.1 A browserify+babel+sourcemap+uglify 处理
gulp.task('jsBabelSourcemapUglify', function(done){
    glob(workSpaceDir+'/js/**.js', function(err, files) {
        console.log('files',files)
        if(err) done(err);
        var tasks = files.map(function(entry) {
            console.log('entry',entry)
            return browserify(entry,{debug:true}).transform(babelify,
                {
                    presets: [["@babel/preset-env",{
                        "useBuiltIns": "usage",
                        "corejs": 3,
                        "debug": true
                    }], "@babel/preset-react"],
                    // plugins: [['@babel/plugin-transform-runtime',{
                    //     "corejs": {
                    //         "version": 3,
                    //         "proposals": true
                    //     },
                    //     "regenerator": true
                    // }]],
                    "ignore": [
                        "node_modules"
                    ],
                    sourceMaps:true
                })
                .bundle()
                .pipe(source(entry.replace(`${workSpaceDir}/js/`,'')))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(uglify())
                // .pipe(gulp.dest(`${distDir}/js/`))
                // .pipe(gulp.dest(`${distDir}/js/`))
                // .pipe(rev.manifest())
                // .on('error', function (err) {
                //     console.error(' rev.manifest出错了'+err)
                // })
                .pipe(sourcemaps.write('./'))
                .on('error', function (err) {
                    console.error('sourcemaps.write出错了'+err)
                })
                .pipe(gulp.dest(`${distDir}/js/`))
                .pipe(gutil.noop())
        });
        eventStream.merge(tasks).on('end', done);
    })
})
// 1.1 B browserify+babel+uglify 处理 没有sourcemap版
gulp.task('jsBabelUglify', function(done){
    glob(workSpaceDir+'/js/**.js', function(err, files) {
        console.log('files',files)
        if(err) done(err);
        var tasks = files.map(function(entry) {
            console.log('entry',entry)
            return browserify(entry,{debug:true}).transform(babelify,
                {
                    presets: [["@babel/preset-env",{
                        "useBuiltIns": "usage",
                        "corejs": 3,
                        "debug": true
                    }], "@babel/preset-react"],
                    // plugins: [['@babel/plugin-transform-runtime',{
                    //     "corejs": {
                    //         "version": 3,
                    //         "proposals": true
                    //     },
                    //     "regenerator": true
                    // }]],
                    "ignore": [
                        "node_modules"
                    ],
                    sourceMaps:true
                })
                .bundle()
                .pipe(source(entry.replace(`${workSpaceDir}/js/`,'')))
                .pipe(buffer())
                .pipe(uglify())

                // .pipe(gulp.dest(`${distDir}/js/`))
                // .pipe(gulp.dest(`${distDir}/js/`))
                // .pipe(rev.manifest())
                // .on('error', function (err) {
                //     console.error(' rev.manifest出错了'+err)
                // })
                .pipe(gulp.dest(`${distDir}/js/`))
                .pipe(gutil.noop())
        });
        eventStream.merge(tasks).on('end', done);
    })
})

// 1.2 js哈希版本处理
gulp.task('jsBabelSourcemapUglifyThenHash',['jsBabelSourcemapUglify'],function () {
        console.log('开始执行js哈希版本处理')
        return  gulp.src(distDir+'/js/**.js')
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(rev())
            .pipe(gulp.dest(distDir+'/js/'))
            .pipe(sourcemaps.write('./'))
            .on('error', function (err) {
                console.error('sourcemaps.write出错了'+err)
            })
            .pipe(gulp.dest(distDir+'/js/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest(distDir+'/js/'))
    }
);
// 1.2 js哈希版本处理 没有sourcemap版
gulp.task('jsBabelUglifyThenHash',['jsBabelUglify'],function () {
        console.log('开始执行js哈希版本处理')
        return  gulp.src(distDir+'/js/**.js')
            .pipe(rev())
            .pipe(gulp.dest(distDir+'/js/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest(distDir+'/js/'))
    }
);






// 1.3 拷贝workspace/js/notchange中所有文件至拷贝workspace/dist/js/notchange
gulp.task('copyNotchangeToDist',function () {
        console.log('开始导出js/notchange 中的所有文件');
        return gulp.src([workSpaceDir+'/js/notchange/*'])
            .pipe(gulp.dest(distDir+'/js/notchange'))
    }
);


// // 清空 dist/js/notchange
gulp.task("cleanNotchangeJs", function(){
    console.log('开始清空js/notchange文件夹');
    return gulp.src([distDir+'/js/notchange'])
        .pipe(clean());
});

// 清空 dist/js/notchange
gulp.task("cleanDist", function(){
    console.log('开始清空dist');
    return gulp.src([distDir])
        .pipe(clean());
});

// 2、弃用方案
// gulp build  依次实现 1、babel语法转换 2、加hash 3、压缩混淆 4、启动build后服务

// js sourcemap和babel及hash值
// gulp.task('sourcemapBabelHashJs', function () {
//     console.log('开始压缩js');
//     // uglify 暂时不加
//     return  gulp.src(workSpaceDir+'/js/*.js')
//         .pipe(sourcemaps.init())
//         .on('error', function (err) {
//             console.error('sourcemaps相关程序出错了'+err)
//         })
//         .pipe(babel({
//             presets: ['@babel/preset-env'],
//             // plugins: ['@babel/transform-runtime'], // 如果启用这个 则会在js中 采用require语法引用的方式 因此不适合
//             // presets: [['@babel/preset-env',{
//             //     "useBuiltIns": "usage",
//             //     "corejs": 3,
//             //     "debug": true
//             // }]],
//             // plugins: [['@babel/plugin-transform-runtime',{
//             //     "corejs": {
//             //         "version": 3,
//             //         "proposals": true
//             //     },
//             //     "regenerator": true
//             // }]],
//             // 如果启用这个 则会在js中 采用require语法引用的方式 因此不适合
//             // 另外 babel-runtime 可以部分取代babel-polyfill功能 但是像 [1,2,3].includes(1)实例方法 则不可替代
//         }))
//         .on('error', function (err) {
//             console.error('babel({\n' +
//                 '            presets: [\'@babel/env\']\n' +
//                 '        })出错了'+err)
//         })
//         .pipe(sourcemaps.write('.'))
//         .on('error', function (err) {
//             console.error('sourcemaps.write出错了'+err)
//         })
//         .pipe(rev())
//         .on('error', function (err) {
//             console.error(' js加hash值出错了 pipe(rev())'+err)
//         })
//         .pipe(gulp.dest(distDir+'/js'))
//         .pipe(rev.manifest())
//         .on('error', function (err) {
//             console.error(' rev.manifest出错了'+err)
//         })
//         // .pipe(uglify())
//         // .on('error', function (err) {
//         //     console.error(' js 压缩混淆出错了 pipe(uglify())'+err)
//         // })
//         .pipe(gulp.dest(distDir+'/js'));
//
//
//     // pump([
//     //         gulp.src(workSpaceDir+'/js/*.js'),
//     //          sourcemaps.init(),
//     //         uglify(),
//     //         // rename({suffix: '.min.'+curDateAndTime}),
//     //         gulp.dest('./dist/js')
//     //     ],
//     //     cb
//     // );
// });


// js sourcemap和babel+transform-runtime及hash值
gulp.task('sourcemapBabelRuntimeHashJs', function () {
    console.log('开始压缩js');
    // uglify 暂时不加
    return  gulp.src(workSpaceDir+'/js/*.js')
        .pipe(sourcemaps.init())
        .on('error', function (err) {
            console.error('sourcemaps相关程序出错了'+err)
        })
        .pipe(babel({
            // presets: ['@babel/env'],
            // plugins: ['@babel/transform-runtime'], // 如果启用这个 则会在js中 采用require语法引用的方式 因此不适合
            presets: [['@babel/preset-env',{
                "useBuiltIns": "usage",
                "corejs": 3,
                "debug": true
            }]],
            plugins: [['@babel/plugin-transform-runtime',{
                "corejs": {
                    "version": 3,
                    "proposals": true
                },
                "regenerator": true
            }]],
            "ignore": [
                "node_modules"
            ]
            // 如果启用这个 则会在js中 采用require语法引用的方式 因此不适合
            // 另外 babel-runtime 可以部分取代babel-polyfill功能 但是像 [1,2,3].includes(1)实例方法 则不可替代
        }))
        .on('error', function (err) {
            console.error('babel({\n' +
                '            presets: [\'@babel/env\']\n' +
                '        })出错了'+err)
        })
        .pipe(sourcemaps.write('.'))
        .on('error', function (err) {
            console.error('sourcemaps.write出错了'+err)
        })
        .pipe(rev())
        .on('error', function (err) {
            console.error(' js加hash值出错了 pipe(rev())'+err)
        })
        .pipe(gulp.dest(distDir+'/js'))
        .pipe(rev.manifest())
        .on('error', function (err) {
            console.error(' rev.manifest出错了'+err)
        })
        // .pipe(uglify())
        // .on('error', function (err) {
        //     console.error(' js 压缩混淆出错了 pipe(uglify())'+err)
        // })
        .pipe(gulp.dest(distDir+'/js'));


    // pump([
    //         gulp.src(workSpaceDir+'/js/*.js'),
    //          sourcemaps.init(),
    //         uglify(),
    //         // rename({suffix: '.min.'+curDateAndTime}),
    //         gulp.dest('./dist/js')
    //     ],
    //     cb
    // );
});


// 将babel run time后require的代码引入使其支持浏览器
gulp.task('browserify', function(done) {
    glob(distDir+'/js/**.js', function(err, files) {
        console.log('files',files)
        if(err) done(err);
        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                // .pipe(rename({
                //     extname: '.bundle.js'
                // }))
                .pipe(gulp.dest('.'));
        });
        eventStream.merge(tasks).on('end', done);
    })
});

gulp.task('sourcemapBabelRuntimeHashJsAndBrowserify', ['sourcemapBabelRuntimeHashJs'],function (done) {
    // condition = false;
    runSequence(
        // ['assetRev'],
        ['browserify'],
        done);
});

// js 压缩
// 其执行的前提是sourcemapBabelRuntimeHashJs先执行完了
gulp.task('sourcemapBabelRuntimeHashJsThenUglifyJs', ['sourcemapBabelRuntimeHashJsAndBrowserify'], function () {
    console.log('开始执行js压缩，不过执行前 要先执行sourcemapBabelRuntimeHashJs')
    return gulp.src(distDir+"/js/*.js")
        .pipe(uglify())
        .on('error', function (err) {
            console.error(' js 压缩混淆出错了 pipe(uglify())'+err)
        })
        .pipe(gulp.dest(distDir+'/js/'));

})



// 三、css相关

gulp.task('remThenJrAndHashCss', ['cssREM'], function () {

    console.log('开始执行css兼容程序')
    // https://www.gulpjs.com.cn/docs/api/#gulp.task
    // cssjr 是css 任务的依赖 因此它要通知css它什么时候执行完了
    // 有三种方式 通知它执行完了 1、回调 2、返回数据流stream  3、返回promise
    var stream = gulp.src(workSpaceDir+'/css/rem/*.css')
        .pipe(autoprefixer({
            browsers: ['since 2010'],
            cascade: false
        }))
        .on('error', function (err) {
            console.error(' css兼容处理出错了 autoprefixer'+err)
        })
        .pipe(rev())
        .on('error', function (err) {
            console.error(' css hash处理出错了 .pipe(rev())'+err)
        })
        .pipe(gulp.dest(distDir+'/css/jianrong'))
        .pipe(rev.manifest())
        .on('error', function (err) {
            console.error(' css hash manifest.json处理出错了 rev.manifest'+err)
        })

        // .pipe(rename({
        //     suffix: ".jr"
        // }))
        .pipe(gulp.dest(distDir+'/css/'));
    console.log(' css兼容程序在执行中 stream ' + stream)
    return stream;

})

// css 加前缀及hash
gulp.task('jrAndHashCss', function () {
    console.log('开始执行css兼容程序')
    // https://www.gulpjs.com.cn/docs/api/#gulp.task
    // cssjr 是css 任务的依赖 因此它要通知css它什么时候执行完了
    // 有三种方式 通知它执行完了 1、回调 2、返回数据流stream  3、返回promise
    var stream = gulp.src(workSpaceDir+'/css/*.css')
        .pipe(autoprefixer({
            browsers: ['since 2010'],
            cascade: false
        }))
        .on('error', function (err) {
            console.error(' css兼容处理出错了 autoprefixer'+err)
        })
        .pipe(rev())
        .on('error', function (err) {
            console.error(' css hash处理出错了 .pipe(rev())'+err)
        })
        .pipe(gulp.dest(distDir+'/css/jianrong'))
        .pipe(rev.manifest())
        .on('error', function (err) {
            console.error(' css hash manifest.json处理出错了 rev.manifest'+err)
        })

        // .pipe(rename({
        //     suffix: ".jr"
        // }))
        .pipe(gulp.dest(distDir+'/css/'));
    console.log(' css兼容程序在执行中 stream ' + stream)
    return stream;


});


// css 压缩
gulp.task('jrAndHashCssThenCompressionCss', ['jrAndHashCss'], function () {
    // 执行该css任务的前提是 执行完了jrAndHashCss （jrAndHashCss是css 的依赖）
    //
    console.log('开始执行css压缩')
    return gulp.src(distDir+"/css/jianrong/*.css")
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .on('error', function (err) {
            console.error(' css压缩处理出错了 cleanCSS'+err)
        })
        // .pipe(rename({
        //     suffix: ".min."+curDateAndTime
        // }))
        .pipe(gulp.dest(distDir+'/css/'));
});
gulp.task('jrAndHashCssThenCompressionCssREM', ['remThenJrAndHashCss'], function () {
    // 执行该css任务的前提是 执行完了jrAndHashCss （jrAndHashCss是css 的依赖）
    //
    console.log('开始执行css压缩')
    return gulp.src(distDir+"/css/jianrong/*.css")
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .on('error', function (err) {
            console.error(' css压缩处理出错了 cleanCSS'+err)
        })
        // .pipe(rename({
        //     suffix: ".min."+curDateAndTime
        // }))
        .pipe(gulp.dest(distDir+'/css/'));
});


// html hash
gulp.task('compressionHtmlThenHashHtml',['compressionHtml'], function () {
    return gulp.src([ distDir+'/**/*.json', distDir+'/*.html'])
        .pipe(revCollector())
        .on('error', function (err) {
            console.error('compressionHtmlThenHashHtml出错了'+err)
        })
        .pipe(gulp.dest(distDir));
});

// html 压缩
gulp.task('compressionHtml', function () {
    return gulp.src(workSpaceDir+"/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .on('error', function (err) {
            console.error('compressionHtml出错了'+err)
        })
        .pipe(gulp.dest(distDir));
});

// 清空文件夹
gulp.task("cleanHTMLCssJsImg", function(){
    console.log('开始清空dist文件夹');
    return gulp.src([distDir+'/*.html',distDir+'/css/*',distDir+'/js/*',distDir+'/img/*'])
        .pipe(clean());
});

// 在<head><meta 之间 注入 polyfill.min.js

gulp.task('injectJS',['copyNotchangeJsAndBabelPolyfill'], function () {
    // var target = gulp.src(distDir+'/*.html');
    // // It's not necessary to read the files (will speed up things), we're only after their paths:
    // // var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});
    // var sources = gulp.src([distDir+'/js/notchange/polyfill.min.js'], {read: false},{relative: true});
    // // console.log('sources',sources)
    //
    // return target.pipe(inject(sources))
    //         .on('error', function (err) {
    //            console.error('injectJS相关程序出错了--target.pipe(inject(sources))'+err)
    //         })
    //     .pipe(gulp.dest(distDir));

    // 1、注入所有js最前面 2、src不需要es6/dist todo
    return  gulp.src(distDir+'/*.html')
        // .pipe(file('es6/dist/index.html', '<html><head></head></html>'))
        //    .on('error', function (err) {
        //       console.error('injectJS相关程序出错了--file(distDir+\'/index.html\''+err)
        //    })
        .pipe(inject(gulp.src([distDir+'/js/notchange/polyfill.min.js']), {
            starttag: '<head>',
            endtag: '<meta',
            relative: true
        })).on('error', function (err) {
            console.error('injectJS相关程序出错了--pipe(inject(gulp.src([distDir'+err)
        })
        .pipe(gulp.dest(distDir));
});


// 1、从node_modules/babel-polyfill/dist中拷贝出 babel-polyfill 文件
// 2、拷贝出workspace 中js/notchange 中所有js 到 dist js/notchange中
gulp.task('copyNotchangeJsAndBabelPolyfill',['cleanNotchangeJs'], function () {
        console.log('开始导出js/notchange 中的所有文件');
        var polyfill = './node_modules/babel-polyfill/dist/polyfill.min.js';

        return gulp.src([workSpaceDir+'/js/notchange/*',polyfill])
            .pipe(gulp.dest(distDir+'/js/notchange'))
    }
);

// gulp.task('exportImg', function () {
//         console.log('开始导出img 中的所有文件');
//         return gulp.src(workSpaceDir+'/img/**/*')
//             .pipe(gulp.dest(distDir+'/img'))
//     }
// );

// 清空 dist/img 文件夹
gulp.task("cleanNotchangeImg", function(){
    console.log('开始清空img文件夹 ');
    return gulp.src([distDir+'/img'])
        .pipe(clean());
});



// 拷贝  workSpace img文件夹 中的文件 至 dist img文件夹下
gulp.task('copyNotchangeImg', ['cleanNotchangeImg'],function(){
    // gulp.start('exportImg')
    console.log('开始导出img 中的所有文件');
    return gulp.src(workSpaceDir+'/img/**/*')
        .pipe(gulp.dest(distDir+'/img'))
});

// 压缩  workSpace img文件夹 中的文件 至 dist img文件夹下
gulp.task('minImg', ['cleanNotchangeImg'],function(){
    // gulp.start('exportImg')
    console.log('开始压缩图片');
    return gulp.src(workSpaceDir+'/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(distDir+'/img'))
});




// 在dist上启动服务
gulp.task('showDistAllFile', function() {
    browserSync.init({
        server: {
            baseDir: distDir
        },
        open:'external',
        files:['*','./**/*'],
        ghostMode: false // 禁止 点击，滚动和表单在任何设备上输入将被镜像到所有设备里

    });
});

// 删除 workspace/js/文件夹下的SourceMap文件
gulp.task('deleteJSSourcemaps', function(){
    return  gulp.src(distDir+'/js/**.map')
        .pipe(clean());

    // return  glob(distDir+'/js/**.map', function(err, files) {
    //      if(err) done(err);
    //      console.log('files sourcemap文件：',files)
    //       files.map(function(filesItem){
    //         try {
    //             fs.unlinkSync(filesItem);
    //             console.log(`删除${filesItem}成功`)
    //         }catch (err) {
    //             if (err) throw err;
    //         }
    //      })
    //  })
})

// 完成一系列流程
// 不压缩图片 启动打包后的项目
gulp.task('build', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelSourcemapUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['copyNotchangeImg'],
        ['copyNotchangeToDist'],
        ['showDistAllFile'],
        done);
});

// 不压缩图片 启动打包后的项目，生成SourceMap文件 但最终会删除，以便单独上传SourceMap，与线上文件名对应
gulp.task('build:rmsm', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelSourcemapUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['copyNotchangeImg'],
        ['copyNotchangeToDist'],
        ['deleteJSSourcemaps'],
        ['showDistAllFile'],
        done);
});

// 不压缩图片 启动打包后的项目,不生成SourceMap文件
gulp.task('build:nosm', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['copyNotchangeImg'],
        ['copyNotchangeToDist'],
        ['showDistAllFile'],
        done);
});

// // 不压缩图片 注入Polyfill
// gulp.task('buildPolyRun', ['cleanHTMLCssJsImg'],function (done) {
//     // condition = false;
//     runSequence(
//         // ['assetRev'],
//         ['sourcemapBabelRuntimeHashJsThenUglifyJs'],
//         ['jrAndHashCssThenCompressionCss'],
//         ['compressionHtmlThenHashHtml'],
//         ['copyNotchangeImg'],
//         ['injectJS'],
//         ['showDistAllFile'],
//         done);
// });

// 不压缩图片 不启动打包后的项目  jenkins专用

gulp.task('buildJK', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelSourcemapUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['copyNotchangeImg'],
        ['copyNotchangeToDist'],
        done);
});
// 不压缩图片 不启动打包后的项目  jenkins专用  生成SourceMap文件 但最终会删除，以便单独上传SourceMap，与线上文件名对应

gulp.task('buildJK:rmsm', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelSourcemapUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['copyNotchangeImg'],
        ['copyNotchangeToDist'],
        ['deleteJSSourcemaps'],
        done);
});

// 不压缩图片 不启动打包后的项目  jenkins专用 不生成SourceMap文件
gulp.task('buildJK:nosm', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['copyNotchangeImg'],
        ['copyNotchangeToDist'],
        done);
});



// 压缩图片  不启动打包后的项目
gulp.task('buildImg', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelSourcemapUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['minImg'],
        ['copyNotchangeToDist'],
        done);
});

// // 压缩图片  启动打包后的项目
gulp.task('buildImgRun', ['cleanHTMLCssJsImg'],function (done) {
    // condition = false;
    runSequence(
        ['cleanDist'],
        ['jsBabelSourcemapUglifyThenHash'],
        ['jrAndHashCssThenCompressionCss'],
        ['compressionHtmlThenHashHtml'],
        ['minImg'],
        ['copyNotchangeToDist'],
        ['showDistAllFile'],
        done);
});

// // 完成一系列流程
// // 压缩图片 注入Polyfill 打开browser-sync
//
// gulp.task('buildImgPolyRun', ['cleanHTMLCssJsImg'],function (done) {
//     // condition = false;
//     runSequence(
//         // ['assetRev'],
//         ['sourcemapBabelRuntimeHashJsThenUglifyJs'],
//         ['jrAndHashCssThenCompressionCss'],
//         ['compressionHtmlThenHashHtml'],
//         ['minImg'],
//         ['injectJS'],
//         ['showDistAllFile'],
//         done);
// });

// // rem适配方案 不压缩图片 不注入Polyfill
// gulp.task('buildrem', ['cleanHTMLCssJsImg'],function (done) {
//     // condition = false;
//     runSequence(
//         // ['assetRev'],
//         ['sourcemapBabelRuntimeHashJsThenUglifyJs'],
//         ['jrAndHashCssThenCompressionCssREM'],
//         ['compressionHtmlThenHashHtml'],
//         ['copyNotchangeImg'],
//         ['copyNotchangeJsAndBabelPolyfill'],
//         ['showDistAllFile'],
//         done);
// });

// rem适配方案 不压缩图片 不注入Polyfill 不打开browser-sync  jenkins专用

// gulp.task('buildremJK', ['cleanHTMLCssJsImg'],function (done) {
//     // condition = false;
//     runSequence(
//         // ['assetRev'],
//         ['sourcemapBabelRuntimeHashJsThenUglifyJs'],
//         ['jrAndHashCssThenCompressionCssREM'],
//         ['compressionHtmlThenHashHtml'],
//         ['copyNotchangeImg'],
//         ['copyNotchangeJsAndBabelPolyfill'],
//         done);
// });

// // 压缩所有图片
// gulp.task('imgMin', function () {
//         console.log('开始压缩图片');
//         return gulp.src(workSpaceDir+'/img/**/*')
//             .pipe(imagemin())
//             .pipe(gulp.dest(distDir+'/img'))
//     }
// );
