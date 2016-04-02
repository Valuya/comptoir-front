import {PATH, APP_SRC} from '../config';

export = function buildJSDev(gulp, plugins) {
  return function () {
    return gulp.src(APP_SRC+'/resources/**')
      .pipe(gulp.dest(PATH.dest.dev.all + '/resources'));
  };
};
