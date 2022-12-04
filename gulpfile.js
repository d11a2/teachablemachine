const gulpfile = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('sass'));

const concat = require('gulp-concat');
const devSer = require('browser-sync').create();
const reload = devSer.reload;

const glob = require('gulp-sass-glob');
const prefixer = require('gulp-autoprefixer');
const groupMediaQueries = require('gulp-group-css-media-queries');
const cleanUp = require('gulp-clean-css')
const sourceMaps = require('gulp-sourcemaps');

const config = require("./gulp.config")
const {DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS} = require("./gulp.config");
const gulpif = require("gulp-if");

const env = process.env.NODE_ENV;

gulpfile.task('clean', () => {
    return gulpfile.src(
        [`${DIST_PATH}/css/*, ${DIST_PATH}/index.html`], {read: false, allowEmpty: true})
        .pipe(rm());
})

gulpfile.task('copy:html', () => {
    console.log('copy:html task')
    return gulpfile.src(`${SRC_PATH}/*.html`)
        .pipe(gulpfile.dest('dist'))
        .pipe(reload({stream: true}));
})

gulpfile.task('copy:svg', () => {
    return gulpfile.src(`${SRC_PATH}/img/*.svg`)
        .pipe(gulpfile.dest(`${DIST_PATH}/img`))
        .pipe(reload({stream: true}));
})

gulpfile.task('css', () => {
    return gulpfile.src(`${SRC_PATH}/scss/*.scss`)
        .pipe(gulpif(env == "dev", sourceMaps.init()))
        .pipe(glob())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulpif(env == "prod", prefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        })))
        .pipe(groupMediaQueries())
        .pipe(gulpif(env == "prod", cleanUp()))
        //.pipe(concat("main.min.css"))
        .pipe(gulpif(env == "dev", sourceMaps.write()))
        .pipe(gulpfile.dest(`${DIST_PATH}/css`))
        .pipe(reload({stream: true}));
})

gulpfile.task('server', function () {
    devSer.init({
        server: {
            baseDir: DIST_PATH
        },
        open: false
    });

});

gulpfile.task('scripts', () => {

   return gulpfile.src(`${SRC_PATH}/js/*.js`)
        .pipe(gulpfile.dest(`${DIST_PATH}/js`))
        .pipe(reload({stream: true}))
})

gulpfile.watch(`${SRC_PATH}/scss/**/*.scss`, gulpfile.series('css'));
gulpfile.watch(`${SRC_PATH}/*.html`, gulpfile.series('copy:html'));
gulpfile.watch(`${SRC_PATH}/js/*.js`, gulpfile.series('scripts'));

gulpfile.task('default', gulpfile.series("clean", "css", "scripts", "copy:html", "server"));

gulpfile.task('build', gulpfile.series("clean", "css", "copy:html", "scripts"));
