const { src, dest } = require('gulp');

function copyHtml() {
  return src('app/renderer/index.html').pipe(dest('build/renderer'));
}

function copyStaticAssets() {
  return src('app/renderer/assets/**').pipe(dest('build/renderer/assets'));
}

copyHtml.displayName = 'copy-html';
copyStaticAssets.displayName = 'copy-static-assets';

exports.copyHtml = copyHtml;
exports.copyStaticAssets = copyStaticAssets;
