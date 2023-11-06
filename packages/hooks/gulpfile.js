/* eslint-disable @typescript-eslint/no-require-imports */
const commonConfig = require('../../gulpfile');
const gulp = require('gulp');
const fs = require('fs'); // 写入文件
const fse = require('fs-extra'); // 写入文件
const fg = require('fast-glob'); // 读取文件
const gm = require('gray-matter'); // 解析信息格式

// 生成描述
async function genDesc(mdPath) {
  if (!fs.existsSync(mdPath)) {
    return;
  }
  const mdFile = fs.readFileSync(mdPath, 'utf8');
  const { content } = gm(mdFile);
  let description =
    (content.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || '';

  description = description.trim();
  description = description.charAt(0).toLowerCase() + description.slice(1);
  return description;
}

// 生成metaData
async function genMetaData() {
  const metadata = {
    functions: [],
  };
  const hooks = fg
    .sync('src/use*', {
      onlyDirectories: true,
    })
    .map((hook) => hook.replace('src/', ''))
    .sort();
  await Promise.allSettled(
    hooks.map(async (hook) => {
      const description = await genDesc(`src/${hook}/index.md`);
      return {
        name: hook,
        description,
      };
    }),
  ).then((res) => {
    metadata.functions = res.map((item) => {
      if (item.status === 'fulfilled') {
        return item.value;
      }
      return null;
    });
  });
  return metadata;
}

// 任务
gulp.task('metadata', async () => {
  const metadata = await genMetaData();
  await fse.writeJson('metadata.json', metadata, { spaces: 2 });
});

// 执行两个任务，一个是外层的commonConfig.default, 一个是这里的metadata
exports.default = gulp.series(commonConfig.default, 'metadata');
// exports.default = gulp.series(commonConfig.default);
