//引入gulp和gulp插件
  var gulp = require('gulp'),  
  runSequence = require('run-sequence'),   
  rev = require('gulp-rev'), 
   replace=require("gulp-replace"),  
    del = require('del'),
   rimraf = require('gulp-rimraf'),
  revCollector = require('gulp-rev-collector');

//定义css、js文件路径，是本地css,js文件的路径，可自行配置
  var base='E:/work/game/game-user-web/src/main/webapp',
     cssUrl = base+'/**/*.css',
     jsUrl = base+'/**/*.js',
     tmpdir='./dist',
  jspdir=base+'/**/*.jsp',
  htmldir=base+'/**/*.html';
  

   //替换掉旧版本号
 gulp.task("replaceVersion",function(){
	return gulp.src([jspdir,htmldir])
	       .pipe(replace(/(\.[js|css]+)\?(v=)?[^\'\"\&]*/g,"$1"))//匹配HTML与JSP中引用的JS.CSS文件
		   .pipe(gulp.dest(base));
 })
 
 
 
//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
  gulp.task('revCss', function(){   
  return gulp.src([cssUrl])
 .pipe(rev())        
 .pipe(rev.manifest())        
 .pipe(gulp.dest('./rev/css'));
 });

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
  gulp.task('revJs', function(){
  return gulp.src(jsUrl)  
 .pipe(rev())        
 .pipe(rev.manifest())
 .pipe(gulp.dest('./rev/js'));
 });


 //Html更换css、js文件版本
   gulp.task('revHtml', function () {    
   return gulp.src(['rev/**/*.json', jspdir,htmldir])  /*webapp是本地html文件的路径，可自行配置*/ 
  .pipe(replace(".jsp","~~~~")) //如果一个文件中引用了A.jsp 正好也有一个A.js文件被修改了，那么会把这个A.JSP替换为a.js?v=****p所以这里先处理一下
  .pipe(revCollector())        
  .pipe(replace("~~~~",".jsp"))
  .pipe(gulp.dest(tmpdir));  /*Html更换css、js文件版本,WEB-INF/views也是和本地html文件的路径一致*/
 });

 //替换文件
 gulp.task("refreshOriginFiles",function(){
	return  gulp.src(['./dist/**/**.*'])//将临时目录下的所有文件复制到目标目录下
	 .pipe(gulp.dest(base));
 })
 //删除临时文件目录
 gulp.task("cleanFile",function(){
	 return gulp.src([tmpdir])
	 .pipe(rimraf())
	 .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); });
 }) 

//开发构建
  gulp.task('dev', function (done) {   
  condition = false;   
  runSequence(
  'replaceVersion',//优先执行    
  ['revCss'],       
  ['revJs'],
  'revHtml',  
  'refreshOriginFiles',  
   'cleanFile',
  done);});
  gulp.task('default', ['dev']);
  
  //监测自动执行
   gulp.task("watch",function(){
	   gulp.watch(cssUrl,['dev']);
	   gulp.watch(jsUrl,['dev']);
   })