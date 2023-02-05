// Adiciona os modulos instalados
const { func } = require('assert-plus');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// função para compilar o css e abrir o servidor
function compilaSass() {
    return gulp.src('scss/**/*scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({cascade: false}))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

// tarefa de gulp parta função de SASS
exports.compilaSass = compilaSass;

//Tarefa para compilar o JS
function gulpJs() {
    return gulp.src('js/main/**/*.js')
    .pipe(concat('main.js'))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

//tarefa do js
exports.gulpjs = gulpJs;

function pluginJS() {
    return gulp
    .src(['node_modules/jquery/dist/jquery.min.js', 'slick-1.8.1/slick/slick.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

exports.pluginsjs = pluginJS;

//função para iniciar o browser
function browser() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    })
}

//tarefa do browser-sync
exports.browser = browser;

//função de wacth do gulp
function wacth() {
    gulp.watch('scss/**/*scss', compilaSass);
    gulp.watch('js/main/**/*.js', gulpJs);
    gulp.watch('js/main/*.js', pluginJS);
    gulp.watch('*.html').on('change', browserSync.reload)
}

//tarefa do Wacth
exports.wacth = wacth;

//tarefa pardão do gulp
exports.default = gulp.parallel(wacth, browser, compilaSass, gulpJs, pluginJS);