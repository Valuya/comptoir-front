import {join} from 'path';
import {PATH, APP_SRC} from '../config';
import {templateLocals} from '../utils';

export = function buildJSDev(gulp, plugins) {
  return function () {
    let tsProject = tsProjectFn(plugins);
    let src = [
                join(PATH.src.all, '**/*.ts'),
                '!' + join(PATH.src.all, '**/*_spec.ts')
              ];

    let result = gulp.src(src)
      .pipe(plugins.plumber())
      .pipe(plugins.inlineNg2Template({ base: APP_SRC, css: false}))
      .pipe(plugins.typescript(tsProject));

    return result.js
      .pipe(plugins.template(templateLocals()))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(PATH.dest.prod.all));
  };
};

function tsProjectFn(plugins) {
    return plugins.typescript.createProject('tsconfig.json', {
        typescript: require('typescript')
    });
}