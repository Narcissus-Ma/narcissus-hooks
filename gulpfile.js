const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const del = require('del');

// 删除上次打包的产物
gulp.task('clean', async () => {
  await del('lib/**');
  await del('es/**');
  await del('dist/**');
});

// 针至不同的类型的产物进行构建 commonjs产物
gulp.task('cjs', () => {
  return gulp
    .src(['./es/**/*.js'])
    .pipe(
      babel({
        configFile: '../../.babelrc',
      }),
    )
    .pipe(gulp.dest('lib/'));
});

// es产物
gulp.task('es', () => {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    module: 'ESNext',
  });
  return tsProject.src().pipe(tsProject()).pipe(babel()).pipe(gulp.dest('es/'));
});

// *.d.ts声明文件
gulp.task('declaration', () => {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    declaration: true,
    emitDeclarationOnly: true,
  });
  return tsProject.src().pipe(tsProject()).pipe(gulp.dest('es/')).pipe(gulp.dest('lib/'));
});

// 复制readme说明文档
gulp.task('copyReadme', async () => {
  await gulp.src('../../README.md').pipe(gulp.dest('../../packages/hooks'));
});

exports.default = gulp.series('clean', 'es', 'cjs', 'declaration', 'copyReadme');
