//����gulp��gulp���
  var gulp = require('gulp'),  
  runSequence = require('run-sequence'),   
  rev = require('gulp-rev'), 
   replace=require("gulp-replace"),  
    del = require('del'),
   rimraf = require('gulp-rimraf'),
  revCollector = require('gulp-rev-collector');

//����css��js�ļ�·�����Ǳ���css,js�ļ���·��������������
  var base='E:/work/game/game-user-web/src/main/webapp',
     cssUrl = base+'/**/*.css',
     jsUrl = base+'/**/*.js',
     tmpdir='./dist',
  jspdir=base+'/**/*.jsp',
  htmldir=base+'/**/*.html';
  

   //�滻���ɰ汾��
 gulp.task("replaceVersion",function(){
	return gulp.src([jspdir,htmldir])
	       .pipe(replace(/(\.[js|css]+)\?(v=)?[^\'\"\&]*/g,"$1"))//ƥ��HTML��JSP�����õ�JS.CSS�ļ�
		   .pipe(gulp.dest(base));
 })
 
 
 
//CSS�����ļ�hash���벢���� rev-manifest.json�ļ�������ӳ��
  gulp.task('revCss', function(){   
  return gulp.src([cssUrl])
 .pipe(rev())        
 .pipe(rev.manifest())        
 .pipe(gulp.dest('./rev/css'));
 });

//js�����ļ�hash���벢���� rev-manifest.json�ļ�������ӳ��
  gulp.task('revJs', function(){
  return gulp.src(jsUrl)  
 .pipe(rev())        
 .pipe(rev.manifest())
 .pipe(gulp.dest('./rev/js'));
 });


 //Html����css��js�ļ��汾
   gulp.task('revHtml', function () {    
   return gulp.src(['rev/**/*.json', jspdir,htmldir])  /*webapp�Ǳ���html�ļ���·��������������*/ 
  .pipe(replace(".jsp","~~~~")) //���һ���ļ���������A.jsp ����Ҳ��һ��A.js�ļ����޸��ˣ���ô������A.JSP�滻Ϊa.js?v=****p���������ȴ���һ��
  .pipe(revCollector())        
  .pipe(replace("~~~~",".jsp"))
  .pipe(gulp.dest(tmpdir));  /*Html����css��js�ļ��汾,WEB-INF/viewsҲ�Ǻͱ���html�ļ���·��һ��*/
 });

 //�滻�ļ�
 gulp.task("refreshOriginFiles",function(){
	return  gulp.src(['./dist/**/**.*'])//����ʱĿ¼�µ������ļ����Ƶ�Ŀ��Ŀ¼��
	 .pipe(gulp.dest(base));
 })
 //ɾ����ʱ�ļ�Ŀ¼
 gulp.task("cleanFile",function(){
	 return gulp.src([tmpdir])
	 .pipe(rimraf())
	 .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); });
 }) 

//��������
  gulp.task('dev', function (done) {   
  condition = false;   
  runSequence(
  'replaceVersion',//����ִ��    
  ['revCss'],       
  ['revJs'],
  'revHtml',  
  'refreshOriginFiles',  
   'cleanFile',
  done);});
  gulp.task('default', ['dev']);
  
  //����Զ�ִ��
   gulp.task("watch",function(){
	   gulp.watch(cssUrl,['dev']);
	   gulp.watch(jsUrl,['dev']);
   })