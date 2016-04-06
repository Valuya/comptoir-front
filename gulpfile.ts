import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';
import {ENV, PATH} from './tools/config';
import {
    autoRegisterTasks,
    registerInjectableAssetsRef,
    task
} from './tools/utils';


// --------------
// Configuration.
autoRegisterTasks();

registerInjectableAssetsRef(PATH.src[ENV].jslib_inject, PATH.dest[ENV].lib);
registerInjectableAssetsRef(PATH.src[ENV].csslib, PATH.dest[ENV].css);


// --------------
// Clean (override).
gulp.task('clean', task('clean', 'all'));
gulp.task('clean.dist', task('clean', 'dist'));
gulp.task('clean.test', task('clean', 'test'));

// --------------
// Postinstall.
gulp.task('postinstall', done =>
runSequence('clean',
    'npm',
    done));


// --------------
// Build dev.
gulp.task('build', done=>
runSequence(`build.${ENV}`, done)
);

gulp.task('build', done =>
runSequence('clean.dist',
    //'tslint',
    'build.jslib',
    'build.sass',
    'build.res',
    `build.js.${ENV}`,
    'build.csslib',
    'build.fonts',
    'build.index',
    done));

// --------------
// Test.
gulp.task('test', done =>
runSequence('clean.test',
    'tslint',
    'build.test',
    'karma.start',
    done));


